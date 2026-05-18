import CityScene from './components/CityScene';
import SidePanel from './components/SidePanel';
import InfoPopup from './components/InfoPopup';
import { typeColors } from './data/buildings';

function App() {
  return (
    <div className="canvas-container">
      <CityScene />
      
      <div className="ui-overlay">
        <header className="header">
          <h1>🌆 3D数字城市可视化大屏</h1>
        </header>
        
        <SidePanel />
        
        <InfoPopup />
        
        <div className="legend">
          <div className="legend-title">建筑类型图例</div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: typeColors.commercial }} />
            <span>商业建筑</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: typeColors.residential }} />
            <span>住宅建筑</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: typeColors.office }} />
            <span>办公建筑</span>
          </div>
        </div>

        <div className="controls-hint">
          <span><kbd>左键</kbd>旋转</span>
          <span><kbd>滚轮</kbd>缩放</span>
          <span><kbd>右键</kbd>平移</span>
          <span><kbd>点击建筑</kbd>查看详情</span>
        </div>
      </div>
    </div>
  );
}

export default App;
