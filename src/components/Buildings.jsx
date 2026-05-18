import Building from './Building';
import { useCityStore } from '../store/useCityStore';

export default function Buildings() {
  const { buildings, selectedBuilding, filterType, setSelectedBuilding } = useCityStore();

  const handleBuildingClick = (building) => {
    setSelectedBuilding(selectedBuilding?.id === building.id ? null : building);
  };

  const handlePointerOver = (e) => {
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
  };

  return (
    <group>
      {buildings.map((building) => (
        <Building
          key={building.id}
          data={building}
          isSelected={selectedBuilding?.id === building.id}
          isFiltered={filterType !== 'all' && building.type !== filterType}
          onClick={handleBuildingClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        />
      ))}
    </group>
  );
}
