import { BUILDING_TYPES, TYPE_COLORS } from "./data";

function SidePanel({ filteredTypes, onToggleType, buildingStats }) {
  const types = [
    BUILDING_TYPES.COMMERCIAL,
    BUILDING_TYPES.RESIDENTIAL,
    BUILDING_TYPES.OFFICE,
  ];

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: "260px",
        background:
          "linear-gradient(180deg, rgba(8, 12, 35, 0.95) 0%, rgba(12, 18, 45, 0.95) 100%)",
        borderRight: "1px solid rgba(0, 255, 255, 0.15)",
        zIndex: 50,
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        color: "#c8d6e5",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "#00ffff",
          marginBottom: "6px",
          letterSpacing: "2px",
        }}
      >
        数字城市
      </div>
      <div
        style={{
          fontSize: "11px",
          color: "#5a7a9a",
          marginBottom: "28px",
          letterSpacing: "1px",
        }}
      >
        DIGITAL CITY VISUALIZATION
      </div>

      <div
        style={{
          fontSize: "13px",
          color: "#7a9ab8",
          marginBottom: "12px",
          letterSpacing: "1px",
        }}
      >
        建筑类型筛选
      </div>

      {types.map((type) => {
        const isActive =
          filteredTypes.length === 0 || filteredTypes.includes(type);
        const color = TYPE_COLORS[type];
        const stats = buildingStats[type] || { count: 0, avgEnergy: 0 };

        return (
          <div
            key={type}
            onClick={() => onToggleType(type)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 12px",
              marginBottom: "8px",
              borderRadius: "8px",
              cursor: "pointer",
              background: isActive
                ? "rgba(255,255,255,0.06)"
                : "rgba(255,255,255,0.02)",
              border: `1px solid ${isActive ? color + "55" : "rgba(255,255,255,0.05)"}`,
              transition: "all 0.3s ease",
              opacity: isActive ? 1 : 0.45,
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "2px",
                background: color,
                marginRight: "10px",
                boxShadow: isActive ? `0 0 8px ${color}66` : "none",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "14px",
                  color: isActive ? "#e0e8ff" : "#5a6a7a",
                }}
              >
                {type}
              </div>
              <div
                style={{ fontSize: "11px", color: "#5a7a9a", marginTop: "2px" }}
              >
                {stats.count}栋 · 均耗 {stats.avgEnergy} kW·h
              </div>
            </div>
            <div
              style={{
                width: "32px",
                height: "18px",
                borderRadius: "9px",
                background: isActive ? color + "44" : "rgba(255,255,255,0.08)",
                border: `1px solid ${isActive ? color + "88" : "rgba(255,255,255,0.1)"}`,
                position: "relative",
                transition: "all 0.3s ease",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: isActive ? color : "#3a4a5a",
                  position: "absolute",
                  top: "2px",
                  left: isActive ? "17px" : "2px",
                  transition: "all 0.3s ease",
                  boxShadow: isActive ? `0 0 6px ${color}88` : "none",
                }}
              />
            </div>
          </div>
        );
      })}

      <div
        style={{
          marginTop: "auto",
          padding: "14px",
          borderRadius: "8px",
          background: "rgba(0, 255, 255, 0.04)",
          border: "1px solid rgba(0, 255, 255, 0.1)",
        }}
      >
        <div
          style={{ fontSize: "12px", color: "#5a8aaa", marginBottom: "8px" }}
        >
          数据概览
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#8ab8d8",
          }}
        >
          <span>建筑总数</span>
          <span style={{ color: "#00ffff", fontWeight: "bold" }}>
            {buildingStats.total || 0}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#8ab8d8",
            marginTop: "4px",
          }}
        >
          <span>总能耗</span>
          <span style={{ color: "#ffaa00", fontWeight: "bold" }}>
            {buildingStats.totalEnergy || 0} kW·h
          </span>
        </div>
      </div>
    </div>
  );
}

export { SidePanel };
