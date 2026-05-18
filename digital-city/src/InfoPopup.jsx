import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ScreenPositionTracker({ building, onPositionUpdate }) {
  const { camera } = useThree();

  useFrame(() => {
    if (!building) return;
    const pos = new THREE.Vector3(
      building.x,
      building.height + 1.5,
      building.z,
    );
    pos.project(camera);
    const canvasRect = document
      .querySelector("canvas")
      ?.getBoundingClientRect();
    if (!canvasRect) return;
    const x = canvasRect.left + (pos.x * 0.5 + 0.5) * canvasRect.width;
    const y = canvasRect.top + (-pos.y * 0.5 + 0.5) * canvasRect.height;
    onPositionUpdate({ x, y, behind: pos.z > 1 });
  });

  return null;
}

function InfoPopup({ building, onDismiss, screenPos }) {
  if (!building) return null;

  const energyLevel =
    building.energy > 300 ? "高" : building.energy > 150 ? "中" : "低";
  const energyColor =
    building.energy > 300
      ? "#ff4444"
      : building.energy > 150
        ? "#ffaa00"
        : "#44ff44";

  return (
    <div
      style={{
        position: "fixed",
        left: `${screenPos.x}px`,
        top: `${screenPos.y}px`,
        transform: "translate(-50%, -100%)",
        pointerEvents: screenPos.behind ? "none" : "auto",
        opacity: screenPos.behind ? 0 : 1,
        zIndex: 100,
        transition: "opacity 0.2s ease",
      }}
    >
      <div
        style={{
          background: "rgba(10, 15, 40, 0.92)",
          border: "1px solid rgba(0, 255, 255, 0.5)",
          borderRadius: "8px",
          padding: "14px 18px",
          color: "#e0e8ff",
          minWidth: "220px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 0 20px rgba(0, 255, 255, 0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <span
            style={{ fontSize: "15px", fontWeight: "bold", color: "#00ffff" }}
          >
            {building.name}
          </span>
          <button
            onClick={onDismiss}
            style={{
              background: "none",
              border: "none",
              color: "#888",
              cursor: "pointer",
              fontSize: "16px",
              lineHeight: "1",
              padding: "0 2px",
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ fontSize: "13px", lineHeight: "1.8" }}>
          <div>
            类型：<span style={{ color: "#aaccff" }}>{building.type}</span>
          </div>
          <div>
            楼层：<span style={{ color: "#aaccff" }}>{building.floors} 层</span>
          </div>
          <div>
            能耗：
            <span style={{ color: energyColor }}>{building.energy} kW·h</span>
            <span
              style={{
                fontSize: "11px",
                marginLeft: "6px",
                color: energyColor,
              }}
            >
              ({energyLevel})
            </span>
          </div>
        </div>
        <div
          style={{
            marginTop: "8px",
            height: "3px",
            borderRadius: "2px",
            background: "rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: "2px",
              width: `${Math.min(100, building.energy / 4.5)}%`,
              background: `linear-gradient(90deg, ${energyColor}, ${energyColor}88)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export { InfoPopup, ScreenPositionTracker };
