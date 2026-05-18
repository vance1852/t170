import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Road({ road }) {
  const [p1, p2] = road.path;
  const dir = new THREE.Vector3(p2[0] - p1[0], 0, p2[2] - p1[2]);
  const len = dir.length();
  const isHorizontal = Math.abs(dir.x) > 0.1;
  const thickness = 0.4;
  const width = isHorizontal ? thickness : thickness * 0.1;
  const height = isHorizontal ? thickness * 0.1 : thickness;
  return (
    <mesh
      position={[(p1[0] + p2[0]) / 2, 0.03, (p1[2] + p2[2]) / 2]}
      rotation={[0, isHorizontal ? 0 : Math.PI / 2, 0]}
    >
      <boxGeometry args={[len, 0.05, 0.4]} />
      <meshStandardMaterial
        color="#1a2a4a"
        emissive="#3a5a8a"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

function Car({ car, isNight }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    car.progress += car.speed * 0.01 * car.direction;
    if (car.progress > 1) car.progress = 0;
    if (car.progress < 0) car.progress = 1;
    const [p1, p2] = car.path;
    const t = car.progress;
    const x = p1[0] + (p2[0] - p1[0]) * t;
    const z = p1[2] + (p2[2] - p1[2]) * t;
    ref.current.position.set(x, 0.15, z);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.12, 8, 8]} />
      <meshBasicMaterial color={car.color} toneMapped={false} />
      <pointLight
        color={car.color}
        intensity={isNight ? 1.2 : 0.4}
        distance={3}
      />
    </mesh>
  );
}

export default function Roads({ roads, cars, isNight }) {
  return (
    <group>
      {roads.map((r) => (
        <Road key={r.id} road={r} />
      ))}
      {cars.map((c) => (
        <Car key={c.id} car={c} isNight={isNight} />
      ))}
    </group>
  );
}
