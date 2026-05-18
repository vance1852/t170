import { useState, useRef, useCallback, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { buildings, BUILDING_TYPES } from "./data";
import { CityScene } from "./CityScene";
import { BuildingParticles } from "./Particles";
import { TrafficLights } from "./Traffic";
import { DayNightCycle } from "./DayNight";
import { InfoPopup, ScreenPositionTracker } from "./InfoPopup";
import { SidePanel } from "./SidePanel";

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [screenPos, setScreenPos] = useState({ x: 0, y: 0, behind: true });
  const timeOfDay = useRef(1);

  const handleBuildingClick = useCallback((id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleToggleType = useCallback((type) => {
    setFilteredTypes((prev) => {
      if (prev.includes(type)) {
        const next = prev.filter((t) => t !== type);
        return next;
      }
      return [...prev, type];
    });
  }, []);

  const selectedBuilding = useMemo(
    () => buildings.find((b) => b.id === selectedId),
    [selectedId],
  );

  const buildingStats = useMemo(() => {
    const stats = {
      [BUILDING_TYPES.COMMERCIAL]: { count: 0, totalEnergy: 0 },
      [BUILDING_TYPES.RESIDENTIAL]: { count: 0, totalEnergy: 0 },
      [BUILDING_TYPES.OFFICE]: { count: 0, totalEnergy: 0 },
    };
    let totalEnergy = 0;
    buildings.forEach((b) => {
      stats[b.type].count++;
      stats[b.type].totalEnergy += b.energy;
      totalEnergy += b.energy;
    });
    Object.keys(stats).forEach((key) => {
      const s = stats[key];
      s.avgEnergy = s.count > 0 ? Math.round(s.totalEnergy / s.count) : 0;
    });
    stats.total = buildings.length;
    stats.totalEnergy = totalEnergy;
    return stats;
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <SidePanel
        filteredTypes={filteredTypes}
        onToggleType={handleToggleType}
        buildingStats={buildingStats}
      />

      <div
        style={{
          position: "absolute",
          left: "260px",
          top: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Canvas
          camera={{ position: [18, 14, 18], fov: 50, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: false }}
          onPointerMissed={() => setSelectedId(null)}
        >
          <DayNightCycle timeOfDay={timeOfDay} />
          <CityScene
            buildings={buildings}
            selectedId={selectedId}
            filteredTypes={filteredTypes}
            onBuildingClick={handleBuildingClick}
          />
          <BuildingParticles
            buildings={buildings}
            filteredTypes={filteredTypes}
          />
          <TrafficLights />
          <ScreenPositionTracker
            building={selectedBuilding}
            onPositionUpdate={setScreenPos}
          />
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={5}
            maxDistance={40}
            maxPolarAngle={Math.PI / 2.1}
          />
        </Canvas>

        <InfoPopup
          building={selectedBuilding}
          onDismiss={() => setSelectedId(null)}
          screenPos={screenPos}
        />

        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            display: "flex",
            gap: "8px",
            alignItems: "center",
            background: "rgba(8, 12, 35, 0.85)",
            borderRadius: "8px",
            padding: "10px 16px",
            border: "1px solid rgba(0, 255, 255, 0.15)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span style={{ fontSize: "12px", color: "#7a9ab8" }}>🌙</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="1"
            onChange={(e) => {
              timeOfDay.current = parseFloat(e.target.value);
            }}
            style={{
              width: "120px",
              accentColor: "#00ffff",
              cursor: "pointer",
            }}
          />
          <span style={{ fontSize: "12px", color: "#7a9ab8" }}>☀️</span>
          <span
            style={{ fontSize: "11px", color: "#5a7a9a", marginLeft: "4px" }}
          >
            昼夜
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(8, 12, 35, 0.8)",
            borderRadius: "8px",
            padding: "8px 24px",
            border: "1px solid rgba(0, 255, 255, 0.2)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              color: "#00ffff",
              letterSpacing: "3px",
              fontWeight: "bold",
            }}
          >
            3D 数字城市可视化大屏
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
