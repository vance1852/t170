import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { roads } from "./data";

function TrafficLights() {
  const groupRef = useRef();
  const pointsPerRoad = 6;
  const totalPoints = roads.length * pointsPerRoad;

  const { basePositions, roadIndices, offsets } = useMemo(() => {
    const pos = new Float32Array(totalPoints * 3);
    const indices = new Float32Array(totalPoints);
    const off = new Float32Array(totalPoints);

    for (let r = 0; r < roads.length; r++) {
      const road = roads[r];
      for (let p = 0; p < pointsPerRoad; p++) {
        const idx = r * pointsPerRoad + p;
        const t = p / pointsPerRoad;
        pos[idx * 3] = road.startX + (road.endX - road.startX) * t;
        pos[idx * 3 + 1] = 0.08;
        pos[idx * 3 + 2] = road.startZ + (road.endZ - road.startZ) * t;
        indices[idx] = r;
        off[idx] = Math.random();
      }
    }
    return { basePositions: pos, roadIndices: indices, offsets: off };
  }, [totalPoints]);

  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    const posArr = meshRef.current.geometry.attributes.position.array;

    for (let i = 0; i < totalPoints; i++) {
      const rIdx = Math.floor(roadIndices[i]);
      const road = roads[rIdx];
      const speed = 0.15 + rIdx * 0.02;
      const t = (((time * speed + offsets[i]) % 1) + 1) % 1;

      posArr[i * 3] = road.startX + (road.endX - road.startX) * t;
      posArr[i * 3 + 1] = 0.08;
      posArr[i * 3 + 2] = road.startZ + (road.endZ - road.startZ) * t;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={totalPoints}
          array={basePositions.slice()}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        color="#ffee88"
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export { TrafficLights };
