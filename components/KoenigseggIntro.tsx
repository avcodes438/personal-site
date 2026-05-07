"use client";

import { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// ─── Timing ───────────────────────────────────────────────────────────────────
const FADE_IN_END  = 1.2;   // car fully scaled in
const SPIN_END     = 6.5;   // spin phase ends
const ANIM_END     = 8.0;   // canvas fades out

// ─── Display ──────────────────────────────────────────────────────────────────
// Scale is computed per-frame from the R3F viewport so the car is always
// ~30 % of viewport width regardless of screen size.
const VIEWPORT_FRACTION = 0.18;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function easeInOut(t: number) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2; }

// ─── Audio ────────────────────────────────────────────────────────────────────
function useEngineAudio() {
  const ac   = useRef<AudioContext|null>(null);
  const osc  = useRef<OscillatorNode|null>(null);
  const osc2 = useRef<OscillatorNode|null>(null);
  const gn   = useRef<GainNode|null>(null);
  const live = useRef(false);

  const start = () => {
    if (live.current) return;
    live.current = true;
    try {
      const ctx = new (window.AudioContext||(window as any).webkitAudioContext)();
      ac.current = ctx;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.6);
      gn.current = gain;
      const filt = ctx.createBiquadFilter();
      filt.type = "lowpass"; filt.frequency.value = 650; filt.Q.value = 2;
      const o1 = ctx.createOscillator(); o1.type = "sawtooth"; o1.frequency.value = 55;
      const o2 = ctx.createOscillator(); o2.type = "square";   o2.frequency.value = 110;
      osc.current = o1; osc2.current = o2;
      const g2 = ctx.createGain(); g2.gain.value = 0.3;
      o1.connect(filt); o2.connect(g2); g2.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
      o1.start(); o2.start();
    } catch(_) {}
  };

  const setRPM = (v: number) => {
    if (!osc.current || !ac.current) return;
    const f = 55 + clamp(v, 0, 1) * 155;
    osc.current.frequency.setTargetAtTime(f,     ac.current.currentTime, 0.12);
    osc2.current!.frequency.setTargetAtTime(f*2, ac.current.currentTime, 0.12);
  };

  const stop = () => {
    if (!gn.current || !ac.current) return;
    gn.current.gain.setTargetAtTime(0, ac.current.currentTime, 0.4);
    setTimeout(() => { osc.current?.stop(); osc2.current?.stop(); ac.current?.close(); }, 1500);
  };

  return { start, setRPM, stop };
}

// ─── Model ────────────────────────────────────────────────────────────────────
function KoenigseggModel({
  onDone,
  rpmRef,
}: {
  onDone: () => void;
  rpmRef: React.MutableRefObject<number>;
}) {
  const group    = useRef<THREE.Group>(null);
  const fbx      = useLoader(FBXLoader, "/koenigsegg/final_Model.fbx");
  const done     = useRef(false);
  const baseS    = useRef(1);
  const { viewport } = useThree();

  // Normalise and centre the model at world origin
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(fbx);
    const sz  = new THREE.Vector3();
    box.getSize(sz);
    const s = 9 / Math.max(sz.x, sz.y, sz.z);
    baseS.current = s;
    fbx.scale.setScalar(s);
    // Re-compute after scale
    box.setFromObject(fbx);
    const center = new THREE.Vector3();
    box.getCenter(center);
    fbx.position.set(-center.x, -center.y, -center.z);
  }, [fbx]);

  useFrame((state) => {
    if (!group.current || done.current) return;
    const t = state.clock.getElapsedTime();

    // ── Scale: viewport-relative so it fits any screen size ─────────────────
    const scaleT = clamp(t / FADE_IN_END, 0, 1);
    // baseS normalises the car to 9 world-units wide; target = 30 % of viewport
    const responsiveScale = (viewport.width * VIEWPORT_FRACTION) / 9;
    group.current.scale.setScalar(baseS.current * responsiveScale * easeInOut(scaleT));

    // ── Rotation: pure turntable Y + fixed overhead pitch ────────────────────
    // No oscillating X/Z — those cause apparent drift and look like floating.
    group.current.rotation.y = t * 0.75;
    group.current.rotation.x = 0.18;   // constant slight overhead tilt (no wobble)
    group.current.rotation.z = 0;

    // ── Audio RPM ─────────────────────────────────────────────────────────────
    const spinP = clamp((t - FADE_IN_END) / (SPIN_END - FADE_IN_END), 0, 1);
    rpmRef.current = clamp(0.15 + spinP * 0.6, 0, 1);

    // ── Done ──────────────────────────────────────────────────────────────────
    if (t >= ANIM_END && !done.current) {
      done.current = true;
      onDone();
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <primitive object={fbx} />
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({ onDone, rpmRef }: { onDone: () => void; rpmRef: React.MutableRefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 12, 8]}  intensity={2.5} color="#ffffff" />
      <directionalLight position={[-5, 5, -4]} intensity={0.8} color="#C9A84C" />
      <pointLight position={[0, 6, 8]}  intensity={3.0} color="#ffffff" />
      <pointLight position={[4, 4, 4]}  intensity={1.8} color="#ffffff" />
      <pointLight position={[-4, 3, 3]} intensity={0.9} color="#64FFDA" />
      <Suspense fallback={null}>
        <KoenigseggModel onDone={onDone} rpmRef={rpmRef} />
      </Suspense>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function KoenigseggIntro() {
  const [visible,  setVisible]  = useState(true);
  const [fadeOut,  setFadeOut]  = useState(false);
  const engine    = useEngineAudio();
  const engineRef = useRef(engine);
  engineRef.current = engine;
  const rpmRef = useRef(0.12);

  useEffect(() => {
    const go = () => engineRef.current.start();
    go();
    window.addEventListener("pointerdown", go, { once: true });
    return () => window.removeEventListener("pointerdown", go);
  }, []);

  useEffect(() => {
    const id = setInterval(() => engineRef.current.setRPM(rpmRef.current), 60);
    return () => clearInterval(id);
  }, []);

  const handleDone = () => {
    engineRef.current.stop();
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
          transition={{ duration: fadeOut ? 0.8 : 0.6 }}
          className="fixed top-0 left-0 w-full h-[38vh] sm:h-[55vh] z-[100] pointer-events-none overflow-hidden"
        >
          {/* Canvas covers only the top ~55 vh so the car can't bleed over the stats strip */}
          <Canvas
            camera={{ position: [0, 0.6, 7], fov: 50 }}
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true } as any}
            style={{
              background: "transparent",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <Scene onDone={handleDone} rpmRef={rpmRef} />
          </Canvas>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
