import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import City from "./scene/City.jsx";
import Roads from "./scene/Roads.jsx";
import Ground from "./scene/Ground.jsx";
import {
  generateBuildings,
  generateRoads,
  generateCars,
  BUILDING_TYPES,
} from "./data";

function DayNightLight({ isNight }) {
  const ambientRef = useRef();
  const dirRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color(isNight ? "#050a1a" : "#1a3a6a");
    scene.fog = new THREE.Fog(isNight ? "#050a1a" : "#1a3a6a", 30, 80);
  }, [scene, isNight]);

  return (
    <>
      <ambientLight
        ref={ambientRef}
        intensity={isNight ? 0.3 : 0.7}
        color={isNight ? "#3a5a8a" : "#ffffff"}
      />
      <directionalLight
        ref={dirRef}
        position={[20, 30, 20]}
        intensity={isNight ? 0.5 : 1.2}
        color={isNight ? "#7ee8ff" : "#fff4d6"}
        castShadow
      />
      {isNight && (
        <pointLight
          position={[0, 15, 0]}
          intensity={1.5}
          color="#7ee8ff"
          distance={40}
        />
      )}
    </>
  );
}

function Scene({
  buildings,
  roads,
  cars,
  selectedId,
  onSelect,
  filter,
  isNight,
}) {
  return (
    <>
      <DayNightLight isNight={isNight} />
      <Ground isNight={isNight} />
      <Roads roads={roads} cars={cars} isNight={isNight} />
      <City
        buildings={buildings}
        selectedId={selectedId}
        onSelect={onSelect}
        filter={filter}
        isNight={isNight}
      />
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={10}
        maxDistance={60}
      />
    </>
  );
}

export default function App() {
  const [buildings] = useState(() => generateBuildings());
  const [roads] = useState(() => generateRoads());
  const [cars] = useState(() => generateCars(roads));
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isNight, setIsNight] = useState(true);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

  const selected = buildings.find((b) => b.id === selectedId);

  useEffect(() => {
    if (!selected) return;
    const updatePos = () => {
      const x = window.innerWidth / 2 + 150;
      const y = window.innerHeight / 2 - 50;
      setPopupPos({ x, y });
    };
    updatePos();
    window.addEventListener("resize", updatePos);
    return () => window.removeEventListener("resize", updatePos);
  }, [selected]);

  const stats = useMemo(() => {
    const totalEnergy = buildings.reduce((s, b) => s + b.energy, 0);
    const avgOccupancy = Math.round(
      buildings.reduce((s, b) => s + b.occupancy, 0) / buildings.length,
    );
    return { totalEnergy, avgOccupancy, count: buildings.length };
  }, [buildings]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas
        camera={{ position: [35, 28, 35], fov: 50 }}
        gl={{ antialias: true }}
        style={{ background: isNight ? "#050a1a" : "#1a3a6a" }}
      >
        <Scene
          buildings={buildings}
          roads={roads}
          cars={cars}
          selectedId={selectedId}
          onSelect={(b) => setSelectedId((cur) => (cur === b.id ? null : b.id))}
          filter={filter}
          isNight={isNight}
        />
      </Canvas>

      <div className="overlay">
        <div className="header">
          <h1>3D 数字城市可视化大屏</h1>
          <p>DIGITAL CITY VISUALIZATION · SMART URBAN</p>
        </div>

        <div className="panel">
          <h3>建筑类型筛选</h3>
          {["all", "commercial", "residential", "office"].map((key) => {
            const label = key === "all" ? "全部" : BUILDING_TYPES[key].label;
            const color = key === "all" ? "#7ee8ff" : BUILDING_TYPES[key].color;
            return (
              <div
                key={key}
                className={`filter-item ${filter === key ? "active" : ""}`}
                onClick={() => setFilter(key)}
              >
                <span className="dot" style={{ background: color }} />
                {label}
              </div>
            );
          })}
        </div>

        <button className="toggle-mode" onClick={() => setIsNight((v) => !v)}>
          {isNight ? "🌙 夜景模式" : "☀️ 白昼模式"}
        </button>

        <div className="stats-bar">
          <div className="stat-card">
            <div className="value">{stats.count}</div>
            <div className="label">建筑总数</div>
          </div>
          <div className="stat-card">
            <div className="value">
              {(stats.totalEnergy / 1000).toFixed(1)}k
            </div>
            <div className="label">总能耗 (kWh)</div>
          </div>
          <div className="stat-card">
            <div className="value">{stats.avgOccupancy}%</div>
            <div className="label">平均入住率</div>
          </div>
        </div>

        {selected && (
          <div
            className="info-popup"
            style={{ left: popupPos.x, top: popupPos.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close" onClick={() => setSelectedId(null)}>
              ✕
            </button>
            <div className="title">{selected.name}</div>
            <div className="row">
              <span className="label">类型</span>
              <span className="value">
                {BUILDING_TYPES[selected.type].label}
              </span>
            </div>
            <div className="row">
              <span className="label">楼层数</span>
              <span className="value">{selected.floors} 层</span>
            </div>
            <div className="row">
              <span className="label">能耗指标</span>
              <span className="value">{selected.energy} kWh</span>
            </div>
            <div className="row">
              <span className="label">入住率</span>
              <span className="value">{selected.occupancy}%</span>
            </div>
            <div className="row">
              <span className="label">建成年份</span>
              <span className="value">{selected.built}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
