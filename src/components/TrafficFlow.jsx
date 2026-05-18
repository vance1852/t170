import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../store/useCityStore';

export default function TrafficFlow() {
  const pointsRef = useRef();
  const { timeOfDay } = useCityStore();
  const gridSize = 120;
  const roadSpacing = 12;

  const { positions, colors, pathData } = useMemo(() => {
    const pos = [];
    const col = [];
    const paths = [];
    const carCount = 80;

    for (let i = 0; i < carCount; i++) {
      const isHorizontal = Math.random() > 0.5;
      const roadIndex = Math.floor(Math.random() * (gridSize / roadSpacing + 1)) - gridSize / roadSpacing / 2;
      const direction = Math.random() > 0.5 ? 1 : -1;
      
      const startOffset = Math.random() * gridSize - gridSize / 2;
      const speed = 0.08 + Math.random() * 0.12;
      
      paths.push({
        isHorizontal,
        roadIndex,
        direction,
        speed,
        progress: Math.random() * gridSize
      });

      pos.push(0, 0.1, 0);
      
      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.1 + 0.55, 0.8, 0.6);
      col.push(color.r, color.g, color.b);
    }

    return { positions: pos, colors: col, pathData: paths };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  useFrame(() => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array;

    pathData.forEach((path, i) => {
      path.progress += path.speed * path.direction;
      
      if (path.progress > gridSize / 2) path.progress = -gridSize / 2;
      if (path.progress < -gridSize / 2) path.progress = gridSize / 2;

      const idx = i * 3;
      const roadPos = path.roadIndex * roadSpacing;

      if (path.isHorizontal) {
        positions[idx] = path.progress;
        positions[idx + 2] = roadPos;
      } else {
        positions[idx] = roadPos;
        positions[idx + 2] = path.progress;
      }
    });

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    const nightFactor = timeOfDay > 0.3 && timeOfDay < 0.7 ? 0.6 : 1.2;
    pointsRef.current.material.opacity = nightFactor;
    pointsRef.current.material.size = 0.4 * nightFactor;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.4}
        vertexColors
        transparent
        opacity={1}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
