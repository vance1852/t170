import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../store/useCityStore';

export default function StreetLights() {
  const lightsRef = useRef();
  const { timeOfDay } = useCityStore();
  const gridSize = 120;
  const spacing = 24;

  const lightPositions = useMemo(() => {
    const positions = [];
    for (let x = -gridSize / 2; x <= gridSize / 2; x += spacing) {
      for (let z = -gridSize / 2; z <= gridSize / 2; z += spacing) {
        if (Math.random() > 0.3) {
          positions.push([x + 3, 5, z + 3]);
          positions.push([x - 3, 5, z - 3]);
        }
      }
    }
    return positions;
  }, []);

  const lightColors = useMemo(() => {
    const colors = [];
    lightPositions.forEach(() => {
      const color = new THREE.Color();
      color.setHSL(0.1 + Math.random() * 0.05, 0.8, 0.6);
      colors.push([color.r, color.g, color.b]);
    });
    return colors;
  }, [lightPositions]);

  useFrame((state) => {
    if (!lightsRef.current) return;

    const isNight = timeOfDay < 0.25 || timeOfDay > 0.75;
    const nightFactor = isNight ? 1 : Math.max(0, 1 - Math.abs(timeOfDay - 0.5) * 4);

    lightsRef.current.children.forEach((lightGroup, i) => {
      const glow = lightGroup.children[0];
      const pole = lightGroup.children[1];
      
      if (glow && glow.material) {
        const flicker = 0.8 + Math.sin(state.clock.elapsedTime * 3 + i * 0.5) * 0.2;
        glow.material.opacity = nightFactor * 0.8 * flicker;
        glow.scale.setScalar(0.8 + nightFactor * 0.4 * flicker);
      }
      
      if (pole && pole.material) {
        pole.material.opacity = 0.3 + nightFactor * 0.7;
      }
    });
  });

  return (
    <group ref={lightsRef}>
      {lightPositions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshBasicMaterial
              color={new THREE.Color(...lightColors[i])}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh position={[0, -2.5, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 5, 6]} />
            <meshStandardMaterial
              color="#333333"
              transparent
              opacity={0.5}
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
