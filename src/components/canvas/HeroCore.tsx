"use client";

import { useRef, useMemo, useEffect, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useDeviceTier";

function NodeNetwork({ scrollProgressRef }: { scrollProgressRef: RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { camera } = useThree();
  const reducedMotion = useReducedMotion();

  const { nodes, edges } = useMemo(() => {
    const count = 14;
    const nodeList: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 1.6 + Math.random() * 0.4;
      nodeList.push(
        new THREE.Vector3(
          r * Math.cos(theta) * Math.sin(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(phi)
        )
      );
    }
    const edgeList: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (nodeList[i].distanceTo(nodeList[j]) < 1.4) {
          edgeList.push([nodeList[i].clone(), nodeList[j].clone()]);
        }
      }
    }
    return { nodes: nodeList, edges: edgeList };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    const scrollProgress = scrollProgressRef.current ?? 0;
    const t = state.clock.elapsedTime;

    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.current.x * 0.08 + t * 0.02,
        0.03
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.current.y * 0.05,
        0.03
      );
    }

    const spread = 1 + scrollProgress * 1.2;
    if (groupRef.current) {
      groupRef.current.scale.setScalar(spread);
      groupRef.current.position.x = 1.2;
      groupRef.current.position.z = scrollProgress * 2;
    }

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 7 - scrollProgress * 2, 0.05);
  });

  const lineMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#1a3a4a", transparent: true, opacity: 0.08 }),
    []
  );
  const edgeLines = useMemo(
    () => edges.map(([a, b]) => new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([a, b]),
      lineMaterial
    )),
    [edges, lineMaterial]
  );

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[0.2, 0]} />
        <meshBasicMaterial color="#1e3a4a" transparent opacity={0.25} wireframe />
      </mesh>
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#1e4a5a" transparent opacity={0.35} />
        </mesh>
      ))}
      {edgeLines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  );
}

interface HeroCoreProps {
  scrollProgressRef: RefObject<number>;
}

export function HeroCore({ scrollProgressRef }: HeroCoreProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      dpr={[1, 1.25]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.15} />
      <NodeNetwork scrollProgressRef={scrollProgressRef} />
    </Canvas>
  );
}
