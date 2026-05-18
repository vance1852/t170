import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../store/useCityStore';

export default function Lighting() {
  const directionalRef = useRef();
  const ambientRef = useRef();
  const hemisphereRef = useRef();
  const { scene } = useThree();
  const { timeOfDay } = useCityStore();

  const colors = useMemo(() => ({
    night: {
      ambient: '#0a0a1a',
      ambientIntensity: 0.15,
      directional: '#1a2a4a',
      directionalIntensity: 0.2,
      hemisphere: ['#0a0a1a', '#050510'],
      hemisphereIntensity: 0.1,
      fog: '#020208',
      sky: '#020208'
    },
    day: {
      ambient: '#ffffff',
      ambientIntensity: 0.8,
      directional: '#ffffff',
      directionalIntensity: 2.0,
      hemisphere: ['#87ceeb', '#e8e4c9'],
      hemisphereIntensity: 1.2,
      fog: '#c4e0f0',
      sky: '#87ceeb'
    },
    sunrise: {
      ambient: '#ff9966',
      ambientIntensity: 0.5,
      directional: '#ffcc00',
      directionalIntensity: 1.2,
      hemisphere: ['#ff7f50', '#ffd700'],
      hemisphereIntensity: 0.8,
      fog: '#ffcc99',
      sky: '#ff7f50'
    },
    sunset: {
      ambient: '#ff6633',
      ambientIntensity: 0.5,
      directional: '#ff8800',
      directionalIntensity: 1.2,
      hemisphere: ['#ff4500', '#ff6600'],
      hemisphereIntensity: 0.8,
      fog: '#cc5500',
      sky: '#ff4500'
    }
  }), []);

  useFrame(() => {
    let currentColors;
    let sunY = 50;
    
    if (timeOfDay < 0.2) {
      currentColors = colors.night;
      sunY = -50;
    } else if (timeOfDay < 0.35) {
      const t = (timeOfDay - 0.2) / 0.15;
      currentColors = interpolateColors(colors.night, colors.sunrise, t);
      currentColors = {
        ...currentColors,
        ambientIntensity: colors.night.ambientIntensity + (colors.sunrise.ambientIntensity - colors.night.ambientIntensity) * t,
        directionalIntensity: colors.night.directionalIntensity + (colors.sunrise.directionalIntensity - colors.night.directionalIntensity) * t,
        hemisphereIntensity: colors.night.hemisphereIntensity + (colors.sunrise.hemisphereIntensity - colors.night.hemisphereIntensity) * t
      };
      sunY = -50 + 100 * t;
    } else if (timeOfDay < 0.5) {
      const t = (timeOfDay - 0.35) / 0.15;
      currentColors = interpolateColors(colors.sunrise, colors.day, t);
      currentColors = {
        ...currentColors,
        ambientIntensity: colors.sunrise.ambientIntensity + (colors.day.ambientIntensity - colors.sunrise.ambientIntensity) * t,
        directionalIntensity: colors.sunrise.directionalIntensity + (colors.day.directionalIntensity - colors.sunrise.directionalIntensity) * t,
        hemisphereIntensity: colors.sunrise.hemisphereIntensity + (colors.day.hemisphereIntensity - colors.sunrise.hemisphereIntensity) * t
      };
      sunY = 50 + 30 * t;
    } else if (timeOfDay < 0.65) {
      const t = (timeOfDay - 0.5) / 0.15;
      currentColors = interpolateColors(colors.day, colors.sunset, t);
      currentColors = {
        ...currentColors,
        ambientIntensity: colors.day.ambientIntensity + (colors.sunset.ambientIntensity - colors.day.ambientIntensity) * t,
        directionalIntensity: colors.day.directionalIntensity + (colors.sunset.directionalIntensity - colors.day.directionalIntensity) * t,
        hemisphereIntensity: colors.day.hemisphereIntensity + (colors.sunset.hemisphereIntensity - colors.day.hemisphereIntensity) * t
      };
      sunY = 80 - 30 * t;
    } else if (timeOfDay < 0.8) {
      const t = (timeOfDay - 0.65) / 0.15;
      currentColors = interpolateColors(colors.sunset, colors.night, t);
      currentColors = {
        ...currentColors,
        ambientIntensity: colors.sunset.ambientIntensity + (colors.night.ambientIntensity - colors.sunset.ambientIntensity) * t,
        directionalIntensity: colors.sunset.directionalIntensity + (colors.night.directionalIntensity - colors.sunset.directionalIntensity) * t,
        hemisphereIntensity: colors.sunset.hemisphereIntensity + (colors.night.hemisphereIntensity - colors.sunset.hemisphereIntensity) * t
      };
      sunY = 50 - 100 * t;
    } else {
      currentColors = colors.night;
      sunY = -50;
    }

    if (ambientRef.current) {
      ambientRef.current.color.set(currentColors.ambient);
      ambientRef.current.intensity = currentColors.ambientIntensity;
    }

    if (directionalRef.current) {
      directionalRef.current.color.set(currentColors.directional);
      directionalRef.current.intensity = currentColors.directionalIntensity;
      
      const angle = (timeOfDay - 0.25) * Math.PI * 2;
      const radius = 100;
      directionalRef.current.position.x = Math.cos(angle) * radius;
      directionalRef.current.position.y = Math.max(sunY, -30);
      directionalRef.current.position.z = Math.sin(angle * 0.5) * radius * 0.5;
    }

    if (hemisphereRef.current) {
      hemisphereRef.current.color.set(currentColors.hemisphere[0]);
      hemisphereRef.current.groundColor.set(currentColors.hemisphere[1]);
      hemisphereRef.current.intensity = currentColors.hemisphereIntensity;
    }

    scene.background = new THREE.Color(currentColors.sky);
    scene.fog = new THREE.Fog(currentColors.fog, 40, 180);
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.8} />
      <directionalLight
        ref={directionalRef}
        position={[50, 80, 30]}
        intensity={2.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />
      <hemisphereLight
        ref={hemisphereRef}
        args={['#87ceeb', '#e8e4c9', 1.2]}
      />
    </>
  );
}

function interpolateColors(color1, color2, t) {
  const result = {};
  for (const key in color1) {
    if (Array.isArray(color1[key])) {
      result[key] = [
        interpolateColor(color1[key][0], color2[key][0], t),
        interpolateColor(color1[key][1], color2[key][1], t)
      ];
    } else if (typeof color1[key] === 'string' && color1[key].startsWith('#')) {
      result[key] = interpolateColor(color1[key], color2[key], t);
    }
  }
  return result;
}

function interpolateColor(color1, color2, t) {
  const c1 = new THREE.Color(color1);
  const c2 = new THREE.Color(color2);
  const r = Math.round(c1.r * 255 + (c2.r * 255 - c1.r * 255) * t);
  const g = Math.round(c1.g * 255 + (c2.g * 255 - c1.g * 255) * t);
  const b = Math.round(c1.b * 255 + (c2.b * 255 - c1.b * 255) * t);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
