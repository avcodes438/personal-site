"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// ─── Timing ───────────────────────────────────────────────────────────────────
const FADE_IN_END = 1.0;
const ANIM_END    = 4.0;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function easeInOut(t: number) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2; }

// ─── Procedural Earth Texture ─────────────────────────────────────────────────
function hash(n: number) {
  const s = Math.sin(n) * 43758.5453;
  return s - Math.floor(s);
}
function noise2d(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix + iy * 57);
  const b = hash(ix + 1 + iy * 57);
  const c = hash(ix + (iy + 1) * 57);
  const d = hash(ix + 1 + (iy + 1) * 57);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}
function fbm(x: number, y: number, oct = 5) {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < oct; i++) { v += noise2d(x * freq, y * freq) * amp; amp *= 0.5; freq *= 2.1; }
  return v;
}

// Continent blobs: [u_center, v_center, u_sigma, v_sigma, strength]
// u = 0..1 (longitude -180→180), v = 0..1 (latitude -90→90, 1 = north)
const CONTINENTS: number[][] = [
  [0.22, 0.65, 0.11, 0.15, 1.0],   // North America
  [0.25, 0.42, 0.07, 0.12, 0.9],   // South America
  [0.50, 0.68, 0.06, 0.08, 0.85],  // Europe
  [0.52, 0.50, 0.09, 0.17, 1.0],   // Africa
  [0.65, 0.67, 0.17, 0.13, 1.0],   // Asia
  [0.74, 0.52, 0.05, 0.07, 0.8],   // Southeast Asia
  [0.74, 0.35, 0.06, 0.06, 0.85],  // Australia
  [0.41, 0.77, 0.05, 0.06, 0.7],   // Greenland
];

function getLand(u: number, v: number): number {
  let land = 0;
  for (const [cu, cv, su, sv, str] of CONTINENTS) {
    const du = (u - cu) / su, dv = (v - cv) / sv;
    land = Math.max(land, Math.exp(-(du * du + dv * dv) / 2) * str);
  }
  land += (fbm(u * 14, v * 7) - 0.5) * 0.28; // jagged coastlines
  return land;
}

function createEarthTexture(): THREE.CanvasTexture {
  const W = 1024, H = 512;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(W, H);
  const d = img.data;

  for (let py = 0; py < H; py++) {
    const v   = 1 - py / H;                       // 1 = north pole
    const lat = (v - 0.5) * 180;
    const latA = Math.abs(lat);

    for (let px = 0; px < W; px++) {
      const u = px / W;
      const land = getLand(u, v);
      const n   = fbm(u * 18, v * 9);
      const idx = (py * W + px) * 4;

      let r = 0, g = 0, b = 0;

      if (latA > 72) {
        // Ice cap
        const t = clamp((latA - 72) / 18, 0, 1);
        r = Math.floor(190 + t * 65); g = Math.floor(210 + t * 45); b = Math.floor(230 + t * 25);
      } else if (land > 0.42) {
        // Land – colour by latitude band
        if (latA < 22) {
          // Tropical
          r = Math.floor(38 + n * 55); g = Math.floor(95 + n * 55); b = Math.floor(18 + n * 28);
        } else if (latA < 48) {
          // Temperate
          r = Math.floor(55 + n * 55); g = Math.floor(88 + n * 48); b = Math.floor(28 + n * 28);
        } else {
          // Boreal / tundra
          r = Math.floor(75 + n * 55); g = Math.floor(85 + n * 40); b = Math.floor(55 + n * 30);
        }
        // Desert band (subtropical dry)
        if (latA > 18 && latA < 32) {
          const desert = clamp((0.7 - land) * 3, 0, 1) * 0.6;
          r = Math.floor(r + desert * (200 - r));
          g = Math.floor(g + desert * (160 - g));
          b = Math.floor(b + desert * (80 - b));
        }
      } else {
        // Ocean – deeper = darker
        const depth = 1 - clamp(land * 2, 0, 1);
        r = Math.floor(6  + depth * 12);
        g = Math.floor(28 + depth * 32);
        b = Math.floor(75 + depth * 65);
      }

      d[idx] = clamp(r, 0, 255);
      d[idx+1] = clamp(g, 0, 255);
      d[idx+2] = clamp(b, 0, 255);
      d[idx+3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ─── Atmosphere shader ────────────────────────────────────────────────────────
const ATM_VERT = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal  = normalize(normalMatrix * normal);
    vViewDir = normalize(-vec3(modelViewMatrix * vec4(position, 1.0)));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const ATM_FRAG = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float rim = 1.0 - abs(dot(vNormal, vViewDir));
    rim = pow(rim, 2.8);
    gl_FragColor = vec4(0.18, 0.52, 1.0, rim * 0.72);
  }
`;

// ─── Globe ────────────────────────────────────────────────────────────────────
function Globe({ onDone }: { onDone: () => void }) {
  const earthRef = useRef<THREE.Mesh>(null);
  const done     = useRef(false);
  const { viewport } = useThree();

  const earthTex = useMemo(() => createEarthTexture(), []);

  // Responsive radius: ~22 % of viewport width
  const radius = viewport.width * 0.13;
  const atmoR  = radius * 1.06;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (earthRef.current) {
      // Scale ease-in
      const sc = easeInOut(clamp(t / FADE_IN_END, 0, 1));
      earthRef.current.scale.setScalar(sc);
      // Slow majestic rotation
      earthRef.current.rotation.y = t * 0.12;
    }
    if (t >= ANIM_END && !done.current) { done.current = true; onDone(); }
  });

  return (
    <group>
      {/* Earth surface */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[radius, 72, 72]} />
        <meshStandardMaterial map={earthTex} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Atmosphere rim glow */}
      <mesh scale={[1, 1, 1]}>
        <sphereGeometry args={[atmoR, 72, 72]} />
        <shaderMaterial
          vertexShader={ATM_VERT}
          fragmentShader={ATM_FRAG}
          transparent
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({ onDone }: { onDone: () => void }) {
  return (
    <>
      {/* Sun-like key light from upper-right */}
      <directionalLight position={[6, 4, 5]}  intensity={3.2} color="#fff8e8" />
      {/* Soft fill from opposite side (space ambient) */}
      <directionalLight position={[-5, -2, -4]} intensity={0.3} color="#2244aa" />
      {/* Subtle ambient so night side isn't pitch black */}
      <ambientLight intensity={0.12} />
      <Globe onDone={onDone} />
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function KoenigseggIntro() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const handleDone = () => {
    setFadeOut(true);
    setTimeout(() => setVisible(false), 800);
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          transition={{ duration: fadeOut ? 0.8 : 0.8 }}
          className="fixed top-20 left-0 w-full h-[38vh] sm:h-[50vh] z-[100] pointer-events-none overflow-hidden"
        >
          <Canvas
            camera={{ position: [0, 0, 7], fov: 50 }}
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true } as any}
            style={{ background: "transparent", width: "100%", height: "100%" }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <Scene onDone={handleDone} />
          </Canvas>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
