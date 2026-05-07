"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type AtomType = "backbone" | "sidechain" | "oxygen";

interface Atom { pos: THREE.Vector3; type: AtomType; radius: number; }

function generateMolecule(scale: number): { atoms: Atom[]; bonds: [number, number][] } {
  const atoms: Atom[] = [];
  const bonds: [number, number][] = [];

  const helixR = scale * 0.34;
  const rise   = scale * 0.21;
  const aStep  = (100 * Math.PI) / 180;
  const nRes   = 9;

  for (let i = 0; i < nRes; i++) {
    const a = i * aStep;
    atoms.push({
      pos: new THREE.Vector3(
        helixR * Math.cos(a),
        (i - (nRes - 1) / 2) * rise,
        helixR * Math.sin(a)
      ),
      type: "backbone",
      radius: scale * 0.125,
    });
    if (i > 0) bonds.push([i - 1, i]);
  }

  for (let i = 1; i < nRes - 1; i += 2) {
    const base    = atoms[i].pos;
    const a       = i * aStep;
    const outward = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
    const tilt    = new THREE.Vector3(0, i % 4 === 1 ? 0.42 : -0.35, 0);
    const dir     = outward.clone().add(tilt).normalize();

    const sc1Pos = base.clone().add(dir.clone().multiplyScalar(scale * 0.32));
    const sc1Idx = atoms.length;
    atoms.push({ pos: sc1Pos, type: i % 4 === 1 ? "oxygen" : "sidechain", radius: scale * 0.096 });
    bonds.push([i, sc1Idx]);

    if (i % 3 !== 2) {
      const sc2Pos = sc1Pos.clone().add(dir.clone().multiplyScalar(scale * 0.22));
      const sc2Idx = atoms.length;
      atoms.push({ pos: sc2Pos, type: "sidechain", radius: scale * 0.078 });
      bonds.push([sc1Idx, sc2Idx]);
    }
  }

  return { atoms, bonds };
}

const ATOM_COLOR: Record<AtomType, string>    = { backbone: "#C9A84C", sidechain: "#64FFDA", oxygen: "#93c5fd" };
const ATOM_EMISSIVE: Record<AtomType, string> = { backbone: "#3a2800", sidechain: "#003a38", oxygen: "#001a3a" };

function MoleculeMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Scale to fill the square canvas while guaranteeing no clipping
  const scale = Math.min(viewport.width, viewport.height) * 0.38;

  const { atoms, bondData } = useMemo(() => {
    const { atoms, bonds } = generateMolecule(scale);
    const bondData = bonds.map(([a, b]) => {
      const p1  = atoms[a].pos;
      const p2  = atoms[b].pos;
      const dir = new THREE.Vector3().subVectors(p2, p1);
      const len = dir.length();
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const q   = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize()
      );
      return { mid, q, len };
    });
    return { atoms, bondData };
  }, [scale]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    groupRef.current.rotation.x = 0.18;
  });

  return (
    <group ref={groupRef}>
      <pointLight position={[0, 0, 0]} intensity={scale * 0.35} color="#C9A84C" distance={scale * 3} decay={2} />

      {atoms.map((atom, i) => (
        <mesh key={`a${i}`} position={atom.pos}>
          <sphereGeometry args={[atom.radius, 24, 24]} />
          <meshStandardMaterial
            color={ATOM_COLOR[atom.type]}
            emissive={ATOM_EMISSIVE[atom.type]}
            emissiveIntensity={0.5}
            roughness={0.18}
            metalness={0.65}
          />
        </mesh>
      ))}

      {bondData.map((b, i) => (
        <mesh key={`b${i}`} position={b.mid} quaternion={b.q}>
          <cylinderGeometry args={[scale * 0.020, scale * 0.020, b.len, 8, 1]} />
          <meshStandardMaterial color="#374151" roughness={0.25} metalness={0.75} transparent opacity={0.72} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroMolecule() {
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
      <ambientLight intensity={0.14} />
      <MoleculeMesh />
    </Canvas>
  );
}
