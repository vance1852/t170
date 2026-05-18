import React, { useMemo } from "react";

export default function Ground({ isNight }) {
  const size = 60;
  const color = isNight ? "#0a1528" : "#1a2a4a";
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[size, size, 1, 1]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.1} />
      </mesh>
      <gridHelper
        args={[
          size,
          20,
          isNight ? "#2a5a8a" : "#3a5a8a",
          isNight ? "#1a3a5a" : "#2a3a5a",
        ]}
        position={[0, 0.01, 0]}
      />
    </group>
  );
}
