import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { BUILDING_TYPES } from "../data";

function Building({ data, selected, visible, onClick, isNight }) {
  const meshRef = useRef();
  const typeColor = BUILDING_TYPES[data.type].color;
  const baseColor = useMemo(() => {
    return isNight ? typeColor : "#2a3f5f";
  }, [isNight, typeColor]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material;
    if (selected) {
      mat.emissive.set("#ffffff");
      mat.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
    } else {
      mat.emissive.set(typeColor);
      mat.emissiveIntensity = isNight ? 0.35 : 0.15;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={data.position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(data);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      <boxGeometry args={data.size} />
      <meshStandardMaterial
        color={baseColor}
        emissive={typeColor}
        emissiveIntensity={selected ? 0.8 : isNight ? 0.35 : 0.15}
        transparent
        opacity={visible ? 1 : 0.15}
        roughness={0.6}
        metalness={0.3}
      />
    </mesh>
  );
}

function BuildingParticles({ data, isNight }) {
  const pointsRef = useRef();
  const count = 12;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * data.size[0] * 0.8;
      arr[i * 3 + 1] = 0;
      arr[i * 3 + 2] = (Math.random() - 0.5) * data.size[2] * 0.8;
    }
    return arr;
  }, [data.size[0], data.size[2]]);

  const basePos = useMemo(
    () => [
      data.position[0],
      data.position[1] + data.size[1] / 2,
      data.position[2],
    ],
    [data.position, data.size[1]],
  );

  useFrame((state) => {
    if (!pointsRef.current) return;
    const elapsed = state.clock.elapsedTime;
    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const phase = elapsed * 2 + i * 0.5;
      pos[i * 3 + 1] = Math.abs(Math.sin(phase)) * 1.5;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={basePos}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        color={BUILDING_TYPES[data.type].color}
        transparent
        opacity={isNight ? 0.9 : 0.5}
        sizeAttenuation
      />
    </points>
  );
}

export default function City({
  buildings,
  selectedId,
  onSelect,
  filter,
  isNight,
}) {
  return (
    <group>
      {buildings.map((b) => {
        const visible = filter === "all" || filter === b.type;
        return (
          <group key={b.id}>
            <Building
              data={b}
              selected={selectedId === b.id}
              visible={visible}
              onClick={onSelect}
              isNight={isNight}
            />
            {visible && <BuildingParticles data={b} isNight={isNight} />}
          </group>
        );
      })}
    </group>
  );
}
