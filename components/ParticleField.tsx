"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const mesh = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();

  const [positions, connections] = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    const pts: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 8;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      pts.push(new THREE.Vector3(x, y, z));
    }

    // Build line connections between nearby points
    const linePositions: number[] = [];
    const threshold = 3.5;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) < threshold) {
          linePositions.push(pts[i].x, pts[i].y, pts[i].z);
          linePositions.push(pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }

    return [pos, new Float32Array(linePositions)];
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.04 + mouse.x * 0.1;
    mesh.current.rotation.x = t * 0.02 + mouse.y * 0.05;
  });

  return (
    <group ref={mesh}>
      {/* Particle dots */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#C9A84C"
          size={0.06}
          sizeAttenuation
          transparent
          opacity={0.8}
        />
      </points>

      {/* Connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[connections, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#64FFDA"
          transparent
          opacity={0.12}
        />
      </lineSegments>
    </group>
  );
}

function DNAHelix() {
  const group = useRef<THREE.Group>(null);

  const [strand1, strand2, rungs] = useMemo(() => {
    const s1: number[] = [];
    const s2: number[] = [];
    const r: number[] = [];
    const turns = 3;
    const pointsPerTurn = 30;
    const total = turns * pointsPerTurn;
    const height = 6;
    const radius = 0.6;

    for (let i = 0; i < total; i++) {
      const t = (i / total) * Math.PI * 2 * turns;
      const y = (i / total) * height - height / 2;

      s1.push(Math.cos(t) * radius, y, Math.sin(t) * radius);
      s2.push(Math.cos(t + Math.PI) * radius, y, Math.sin(t + Math.PI) * radius);

      if (i % 6 === 0) {
        r.push(
          Math.cos(t) * radius, y, Math.sin(t) * radius,
          Math.cos(t + Math.PI) * radius, y, Math.sin(t + Math.PI) * radius
        );
      }
    }

    return [
      new Float32Array(s1),
      new Float32Array(s2),
      new Float32Array(r),
    ];
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = t * 0.3;
    group.current.position.y = Math.sin(t * 0.4) * 0.3;
  });

  return (
    <group ref={group} position={[4.5, 0, -2]}>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[strand1, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#C9A84C" transparent opacity={0.7} />
      </line>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[strand2, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#64FFDA" transparent opacity={0.7} />
      </line>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[rungs, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
}


function FloatingSphere({ position, color, size }: {
  position: [number, number, number];
  color: string;
  size: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const speed = useMemo(() => 0.3 + Math.random() * 0.5, []);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    mesh.current.position.y = position[1] + Math.sin(t * speed + offset) * 0.4;
    mesh.current.rotation.x = t * 0.3;
    mesh.current.rotation.z = t * 0.2;
  });

  return (
    <mesh ref={mesh} position={position}>
      <icosahedronGeometry args={[size, 1]} />
      <meshStandardMaterial
        color={color}
        wireframe
        transparent
        opacity={0.25}
      />
    </mesh>
  );
}

export default function ParticleField() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#C9A84C" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#64FFDA" />
        <Particles />
        <DNAHelix />
        <FloatingSphere position={[-5, 1, -2]} color="#C9A84C" size={0.8} />
        <FloatingSphere position={[5, -1, -3]} color="#64FFDA" size={0.6} />
        <FloatingSphere position={[0, 3, -4]} color="#C9A84C" size={0.4} />
      </Canvas>
    </div>
  );
}
