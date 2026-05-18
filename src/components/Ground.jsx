import { useMemo } from 'react';
import * as THREE from 'three';

export default function Ground() {
  const gridSize = 120;
  const roadWidth = 2;
  const roadSpacing = 12;

  const roads = useMemo(() => {
    const roadMeshes = [];
    
    for (let i = -gridSize / 2; i <= gridSize / 2; i += roadSpacing) {
      roadMeshes.push(
        <mesh key={`h-${i}`} position={[0, 0.01, i]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[gridSize, roadWidth]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
        </mesh>
      );
      roadMeshes.push(
        <mesh key={`v-${i}`} position={[i, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[roadWidth, gridSize]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
        </mesh>
      );
    }
    
    return roadMeshes;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[gridSize, gridSize]} />
        <meshStandardMaterial color="#0d1117" roughness={0.9} />
      </mesh>
      
      {roads}
      
      <gridHelper
        args={[gridSize, gridSize / roadSpacing, '#1a3a5c', '#0a1628']}
        position={[0, 0.02, 0]}
      />
    </group>
  );
}
