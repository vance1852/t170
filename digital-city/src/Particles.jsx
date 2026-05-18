import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function BuildingParticles({ buildings, filteredTypes }) {
  const meshRef = useRef();
  const count = buildings.length * 20;

  const { positions, velocities, buildingIds, offsets } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const ids = new Float32Array(count);
    const off = new Float32Array(count);

    for (let i = 0; i < buildings.length; i++) {
      const b = buildings[i];
      for (let j = 0; j < 20; j++) {
        const idx = i * 20 + j;
        pos[idx * 3] = b.x + (Math.random() - 0.5) * b.width * 0.8;
        pos[idx * 3 + 1] = b.height + Math.random() * 2;
        pos[idx * 3 + 2] = b.z + (Math.random() - 0.5) * b.depth * 0.8;
        vel[idx * 3] = (Math.random() - 0.5) * 0.01;
        vel[idx * 3 + 1] = 0.01 + Math.random() * 0.02;
        vel[idx * 3 + 2] = (Math.random() - 0.5) * 0.01;
        ids[idx] = i;
        off[idx] = Math.random() * Math.PI * 2;
      }
    }
    return { positions: pos, velocities: vel, buildingIds: ids, offsets: off };
  }, [buildings, count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const posArr = meshRef.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const bIdx = Math.floor(buildingIds[i]);
      const b = buildings[bIdx];
      if (!b) continue;

      const isFiltered =
        filteredTypes.length > 0 && !filteredTypes.includes(b.type);

      const baseX = b.x + Math.sin(time * 0.5 + offsets[i]) * b.width * 0.3;
      const baseZ =
        b.z + Math.cos(time * 0.5 + offsets[i] * 1.3) * b.depth * 0.3;
      const baseY = b.height + 0.5 + Math.sin(time * 2 + offsets[i]) * 1.5;

      posArr[i * 3] = isFiltered ? b.x : baseX;
      posArr[i * 3 + 1] = isFiltered ? b.height * 0.5 : baseY;
      posArr[i * 3 + 2] = isFiltered ? b.z : baseZ;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    for (let i = 0; i < buildings.length; i++) {
      const b = buildings[i];
      const c = new THREE.Color();
      if (b.type === "商业") c.set("#ff6b35");
      else if (b.type === "住宅") c.set("#4ecdc4");
      else c.set("#45b7d1");

      for (let j = 0; j < 20; j++) {
        const idx = i * 20 + j;
        cols[idx * 3] = c.r;
        cols[idx * 3 + 1] = c.g;
        cols[idx * 3 + 2] = c.b;
      }
    }
    return cols;
  }, [buildings, count]);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export { BuildingParticles };
