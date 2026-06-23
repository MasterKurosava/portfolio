"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function AssemblyParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const targetPositions = useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const scattered = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 1.5 + (i % 3) * 0.3;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = Math.sin(angle) * r * 0.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      scattered[i * 3] = (Math.random() - 0.5) * 8;
      scattered[i * 3 + 1] = (Math.random() - 0.5) * 8;
      scattered[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }

    return { positions, scattered, count };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(targetPositions.scattered.slice(), 3));
    return geo;
  }, [targetPositions]);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;

    const t = state.clock.elapsedTime;
    const progress = Math.min(1, (Math.sin(t * 0.3) + 1) * 0.5 * 0.6 + 0.4);
    const pos = points.geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < targetPositions.count; i++) {
      const sx = targetPositions.scattered[i * 3];
      const sy = targetPositions.scattered[i * 3 + 1];
      const sz = targetPositions.scattered[i * 3 + 2];
      const tx = targetPositions.positions[i * 3];
      const ty = targetPositions.positions[i * 3 + 1];
      const tz = targetPositions.positions[i * 3 + 2];

      pos.setXYZ(
        i,
        THREE.MathUtils.lerp(sx, tx, progress),
        THREE.MathUtils.lerp(sy, ty, progress),
        THREE.MathUtils.lerp(sz, tz, progress)
      );
    }
    pos.needsUpdate = true;
    points.rotation.y = t * 0.1;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.04} color="#00d4ff" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

export function FinaleAssembly() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.2} />
      <AssemblyParticles />
      <mesh>
        <torusGeometry args={[1.8, 0.02, 8, 64]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.4} />
      </mesh>
    </Canvas>
  );
}
