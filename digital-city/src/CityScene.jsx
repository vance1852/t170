import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TYPE_COLORS, roads } from "./data";

function Building({ data, isSelected, isFiltered, onClick }) {
  const meshRef = useRef();
  const edgesRef = useRef();
  const glowRef = useRef();
  const baseColor = TYPE_COLORS[data.type];

  const edgesGeometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(data.width, data.height, data.depth);
    return new THREE.EdgesGeometry(geo);
  }, [data.width, data.height, data.depth]);

  useFrame((state) => {
    if (glowRef.current) {
      const mat = glowRef.current.material;
      mat.opacity = isSelected
        ? 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.15
        : 0;
    }
    if (meshRef.current) {
      const mat = meshRef.current.material;
      if (isFiltered) {
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.12, 0.05);
      } else {
        mat.opacity = THREE.MathUtils.lerp(
          mat.opacity,
          isSelected ? 1.0 : 0.85,
          0.08,
        );
      }
    }
  });

  return (
    <group position={[data.x, data.height / 2, data.z]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(data.id);
        }}
      >
        <boxGeometry args={[data.width, data.height, data.depth]} />
        <meshStandardMaterial
          color={isSelected ? "#ffffff" : baseColor}
          transparent
          opacity={0.85}
          metalness={0.3}
          roughness={0.6}
        />
      </mesh>

      <lineSegments ref={edgesRef} geometry={edgesGeometry}>
        <lineBasicMaterial
          color={isSelected ? "#00ffff" : "#ffffff"}
          transparent
          opacity={isSelected ? 0.9 : 0.2}
        />
      </lineSegments>

      <mesh ref={glowRef} position={[0, 0, 0]}>
        <boxGeometry
          args={[data.width + 0.3, data.height + 0.3, data.depth + 0.3]}
        />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function Ground() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
    >
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#1a1a2e" metalness={0.1} roughness={0.9} />
    </mesh>
  );
}

function RoadMesh({ road }) {
  const isHorizontal = road.startZ === road.endZ;
  const roadWidth = 0.8;
  const length = isHorizontal
    ? Math.abs(road.endX - road.startX)
    : Math.abs(road.endZ - road.startZ);
  const cx = (road.startX + road.endX) / 2;
  const cz = (road.startZ + road.endZ) / 2;

  return (
    <mesh
      position={[cx, 0.01, cz]}
      rotation={[-Math.PI / 2, 0, isHorizontal ? 0 : Math.PI / 2]}
    >
      <planeGeometry args={[length, roadWidth]} />
      <meshStandardMaterial color="#2d2d44" metalness={0.2} roughness={0.7} />
    </mesh>
  );
}

function RoadLine({ road }) {
  const isHorizontal = road.startZ === road.endZ;
  const length = isHorizontal
    ? Math.abs(road.endX - road.startX)
    : Math.abs(road.endZ - road.startZ);
  const cx = (road.startX + road.endX) / 2;
  const cz = (road.startZ + road.endZ) / 2;

  return (
    <mesh
      position={[cx, 0.03, cz]}
      rotation={[-Math.PI / 2, 0, isHorizontal ? 0 : Math.PI / 2]}
    >
      <planeGeometry args={[length, 0.04]} />
      <meshBasicMaterial color="#4a4a6a" />
    </mesh>
  );
}

function CityScene({ buildings, selectedId, filteredTypes, onBuildingClick }) {
  return (
    <group>
      <Ground />
      {roads.map((road) => (
        <group key={road.id}>
          <RoadMesh road={road} />
          <RoadLine road={road} />
        </group>
      ))}
      {buildings.map((b) => {
        const isFiltered =
          filteredTypes.length > 0 && !filteredTypes.includes(b.type);
        return (
          <Building
            key={b.id}
            data={b}
            isSelected={selectedId === b.id}
            isFiltered={isFiltered}
            onClick={onBuildingClick}
          />
        );
      })}
    </group>
  );
}

export { CityScene };
