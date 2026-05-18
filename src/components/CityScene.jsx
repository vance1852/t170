import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Ground from './Ground';
import Buildings from './Buildings';
import EnergyParticles from './EnergyParticles';
import TrafficFlow from './TrafficFlow';
import Lighting from './Lighting';
import StreetLights from './StreetLights';

export default function CityScene() {
  return (
    <Canvas
      camera={{ position: [60, 50, 60], fov: 50 }}
      shadows
      gl={{ antialias: true, alpha: false }}
      onClick={(e) => {
        if (e.object === e.currentTarget) {
        }
      }}
    >
      <Lighting />
      <Ground />
      <Buildings />
      <EnergyParticles />
      <TrafficFlow />
      <StreetLights />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={20}
        maxDistance={150}
        maxPolarAngle={Math.PI / 2 - 0.1}
        minPolarAngle={0.2}
      />
    </Canvas>
  );
}
