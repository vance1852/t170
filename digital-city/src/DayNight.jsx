import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function DayNightCycle({ timeOfDay }) {
  const { scene } = useThree();
  const lightRef = useRef();
  const hemiRef = useRef();

  const dayColor = new THREE.Color("#87CEEB");
  const nightColor = new THREE.Color("#0a0a1a");
  const dayAmbient = new THREE.Color("#b4c8e0");
  const nightAmbient = new THREE.Color("#1a1a3e");
  const dayHemiSky = new THREE.Color("#87CEEB");
  const nightHemiSky = new THREE.Color("#0a0a2e");
  const dayHemiGround = new THREE.Color("#3d5c3d");
  const nightHemiGround = new THREE.Color("#0a0a15");

  useFrame(() => {
    const t = timeOfDay.current;
    const bgColor = new THREE.Color().lerpColors(nightColor, dayColor, t);
    scene.background = bgColor;
    scene.fog = new THREE.Fog(bgColor, 25, 50);

    if (lightRef.current) {
      lightRef.current.color.lerpColors(nightAmbient, dayAmbient, t);
      lightRef.current.intensity = 0.3 + t * 0.7;
    }

    if (hemiRef.current) {
      hemiRef.current.color.lerpColors(nightHemiSky, dayHemiSky, t);
      hemiRef.current.groundColor.lerpColors(nightHemiGround, dayHemiGround, t);
      hemiRef.current.intensity = 0.2 + t * 0.6;
    }
  });

  return (
    <>
      <ambientLight ref={lightRef} intensity={0.6} />
      <hemisphereLight ref={hemiRef} intensity={0.5} />
      <directionalLight
        position={[10, 15, 5]}
        intensity={0.8}
        color="#ffffff"
        castShadow
      />
    </>
  );
}

export { DayNightCycle };
