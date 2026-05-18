import { useCityStore } from '../store/useCityStore';
import { typeLabels, typeColors } from '../data/buildings';

export default function SidePanel() {
  const { filterType, setFilterType, timeOfDay, setTimeOfDay, buildings } = useCityStore();

  const filterOptions = [
    { key: 'all', label: '全部建筑', icon: 'all' },
    { key: 'commercial', label: '商业建筑', icon: 'commercial' },
    { key: 'residential', label: '住宅建筑', icon: 'residential' },
    { key: 'office', label: '办公建筑', icon: 'office' }
  ];

  const stats = {
    total: buildings.length,
    commercial: buildings.filter(b => b.type === 'commercial').length,
    residential: buildings.filter(b => b.type === 'residential').length,
    office: buildings.filter(b => b.type === 'office').length,
    totalEnergy: buildings.reduce((sum, b) => sum + b.energyConsumption, 0)
  };

  const getTimeLabel = (time) => {
    const hour = Math.floor(time * 24);
    const minute = Math.floor((time * 24 - hour) * 60);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const getTimePeriod = (time) => {
    if (time < 0.2) return '深夜';
    if (time < 0.35) return '清晨';
    if (time < 0.5) return '上午';
    if (time < 0.65) return '下午';
    if (time < 0.8) return '傍晚';
    return '夜晚';
  };

  return (
    <div className="side-panel">
      <div className="panel-title">
        <span>🏙️</span>
        <span>城市控制面板</span>
      </div>

      <div className="filter-section">
        <div className="filter-label">建筑类型筛选</div>
        <div className="filter-buttons">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              className={`filter-btn ${filterType === option.key ? 'active' : ''}`}
              onClick={() => setFilterType(option.key)}
            >
              <div className={`icon ${option.icon}`} />
              <span>{option.label}</span>
              <span style={{ marginLeft: 'auto', opacity: 0.6 }}>
                {option.key === 'all' ? stats.total : stats[option.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="stats-section">
        <div className="filter-label">城市统计</div>
        <div className="stat-item">
          <span className="stat-label">建筑总数</span>
          <span className="stat-value">{stats.total} 栋</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">总能耗</span>
          <span className="stat-value">{(stats.totalEnergy / 1000).toFixed(1)} MWh/月</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">平均入住率</span>
          <span className="stat-value">
            {Math.round(buildings.reduce((sum, b) => sum + b.occupancy, 0) / buildings.length)}%
          </span>
        </div>
      </div>

      <div className="time-control">
        <div className="filter-label">时间控制</div>
        <input
          type="range"
          className="time-slider"
          min="0"
          max="1"
          step="0.01"
          value={timeOfDay}
          onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
        />
        <div className="time-display">
          {getTimeLabel(timeOfDay)} - {getTimePeriod(timeOfDay)}
        </div>
      </div>
    </div>
  );
}
