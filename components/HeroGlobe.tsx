"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Procedural Earth (shared logic, see KoenigseggIntro for full notes) ──────
function hash(n: number) { const s = Math.sin(n) * 43758.5453; return s - Math.floor(s); }
function noise2d(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix + iy * 57), b = hash(ix + 1 + iy * 57);
  const c = hash(ix + (iy + 1) * 57), d = hash(ix + 1 + (iy + 1) * 57);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}
function fbm(x: number, y: number, oct = 5) {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < oct; i++) { v += noise2d(x * freq, y * freq) * amp; amp *= 0.5; freq *= 2.1; }
  return v;
}
const CONTINENTS: number[][] = [
  [0.22, 0.65, 0.11, 0.15, 1.0], [0.25, 0.42, 0.07, 0.12, 0.9],
  [0.50, 0.68, 0.06, 0.08, 0.85], [0.52, 0.50, 0.09, 0.17, 1.0],
  [0.65, 0.67, 0.17, 0.13, 1.0], [0.74, 0.52, 0.05, 0.07, 0.8],
  [0.74, 0.35, 0.06, 0.06, 0.85], [0.41, 0.77, 0.05, 0.06, 0.7],
];
function getLand(u: number, v: number) {
  let land = 0;
  for (const [cu, cv, su, sv, str] of CONTINENTS) {
    const du = (u - cu) / su, dv = (v - cv) / sv;
    land = Math.max(land, Math.exp(-(du * du + dv * dv) / 2) * str);
  }
  return land + (fbm(u * 14, v * 7) - 0.5) * 0.28;
}
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function createEarthTexture(): THREE.CanvasTexture {
  const W = 512, H = 256;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(W, H);
  const d = img.data;
  for (let py = 0; py < H; py++) {
    const v = 1 - py / H, lat = (v - 0.5) * 180, latA = Math.abs(lat);
    for (let px = 0; px < W; px++) {
      const u = px / W, land = getLand(u, v), n = fbm(u * 18, v * 9);
      const idx = (py * W + px) * 4;
      let r = 0, g = 0, b = 0;
      if (latA > 72) {
        const t = clamp((latA - 72) / 18, 0, 1);
        r = Math.floor(190 + t * 65); g = Math.floor(210 + t * 45); b = Math.floor(230 + t * 25);
      } else if (land > 0.42) {
        if (latA < 22) { r = Math.floor(38 + n*55); g = Math.floor(95 + n*55); b = Math.floor(18 + n*28); }
        else if (latA < 48) { r = Math.floor(55 + n*55); g = Math.floor(88 + n*48); b = Math.floor(28 + n*28); }
        else { r = Math.floor(75 + n*55); g = Math.floor(85 + n*40); b = Math.floor(55 + n*30); }
      } else {
        const depth = 1 - clamp(land * 2, 0, 1);
        r = Math.floor(6 + depth*12); g = Math.floor(28 + depth*32); b = Math.floor(75 + depth*65);
      }
      d[idx] = clamp(r,0,255); d[idx+1] = clamp(g,0,255); d[idx+2] = clamp(b,0,255); d[idx+3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ─── Globe mesh ───────────────────────────────────────────────────────────────
function GlobeMesh() {
  const ref = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const tex = useMemo(() => createEarthTexture(), []);
  const radius = Math.min(viewport.width, viewport.height) * 0.36;

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    ref.current.rotation.x = 0.18;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius, 48, 48]} />
      <meshStandardMaterial map={tex} roughness={0.85} metalness={0.05} />
    </mesh>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function HeroGlobe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true } as any}
      style={{ background: "transparent", width: "100%", height: "100%" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <directionalLight position={[6, 4, 5]}   intensity={3.2} color="#fff8e8" />
      <directionalLight position={[-5, -2, -4]} intensity={0.3} color="#2244aa" />
      <ambientLight intensity={0.12} />
      <GlobeMesh />
    </Canvas>
  );
}
