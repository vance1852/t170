import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../store/useCityStore';

export default function EnergyParticles() {
  const pointsRef = useRef();
  const { buildings, filterType, timeOfDay } = useCityStore();

  const particleData = useMemo(() => {
    const positions = [];
    const colors = [];
    const sizes = [];
    const speeds = [];
    const offsets = [];

    buildings.forEach((building) => {
      const particleCount = Math.floor(building.energyConsumption / 50);
      const baseX = building.position[0];
      const baseZ = building.position[2];
      const baseY = building.size[1];

      for (let i = 0; i < particleCount; i++) {
        positions.push(
          baseX + (Math.random() - 0.5) * building.size[0] * 0.8,
          baseY + Math.random() * 5,
          baseZ + (Math.random() - 0.5) * building.size[2] * 0.8
        );

        const energyRatio = building.energyConsumption / 2500;
        const color = new THREE.Color();
        color.setHSL(0.3 - energyRatio * 0.3, 1, 0.5 + energyRatio * 0.2);
        colors.push(color.r, color.g, color.b);

        sizes.push(0.1 + Math.random() * 0.15);
        speeds.push(0.02 + Math.random() * 0.03);
        offsets.push(Math.random() * Math.PI * 2);
      }
    });

    return { positions, colors, sizes, speeds, offsets, count: positions.length / 3 };
  }, [buildings]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(particleData.positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(particleData.colors, 3));
    geo.setAttribute('size', new THREE.Float32BufferAttribute(particleData.sizes, 1));
    return geo;
  }, [particleData]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < particleData.count; i++) {
      const idx = i * 3;
      const buildingIndex = Math.floor(i / (particleData.count / buildings.length));
      const building = buildings[Math.min(buildingIndex, buildings.length - 1)];
      
      positions[idx + 1] += particleData.speeds[i];
      
      if (positions[idx + 1] > building.size[1] + 8) {
        positions[idx + 1] = building.size[1];
      }

      positions[idx] += Math.sin(time * 2 + particleData.offsets[i]) * 0.01;
      positions[idx + 2] += Math.cos(time * 2 + particleData.offsets[i]) * 0.01;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    const visibility = filterType === 'all' ? 1 : 0.3;
    pointsRef.current.material.opacity = visibility * (timeOfDay > 0.3 && timeOfDay < 0.7 ? 0.8 : 1);
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.3}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
