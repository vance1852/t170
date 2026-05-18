import { useCityStore } from '../store/useCityStore';
import { typeLabels } from '../data/buildings';

export default function InfoPopup() {
  const { selectedBuilding, setSelectedBuilding } = useCityStore();

  if (!selectedBuilding) return null;

  const energyPercent = (selectedBuilding.energyConsumption / 2500) * 100;

  return (
    <div
      className="info-popup"
      style={{
        left: '50%',
        top: '40%'
      }}
    >
      <button className="close-btn" onClick={() => setSelectedBuilding(null)}>
        ×
      </button>
      <h3>{selectedBuilding.name}</h3>
      <div className="info-row">
        <span className="label">建筑类型</span>
        <span className="value">{typeLabels[selectedBuilding.type]}</span>
      </div>
      <div className="info-row">
        <span className="label">楼层数</span>
        <span className="value">{selectedBuilding.floors} 层</span>
      </div>
      <div className="info-row">
        <span className="label">入住率</span>
        <span className="value">{selectedBuilding.occupancy}%</span>
      </div>
      <div className="info-row">
        <span className="label">建成年份</span>
        <span className="value">{selectedBuilding.yearBuilt} 年</span>
      </div>
      <div className="info-row">
        <span className="label">能耗指标</span>
        <span className="value">{selectedBuilding.energyConsumption} kWh/月</span>
      </div>
      <div className="energy-bar">
        <div className="energy-fill" style={{ width: `${energyPercent}%` }} />
      </div>
      <div className="energy-label">能耗等级: {energyPercent > 80 ? '高' : energyPercent > 50 ? '中' : '低'}</div>
    </div>
  );
}
