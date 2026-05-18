const buildingTypes = ['commercial', 'residential', 'office'];

const buildingNames = {
  commercial: ['环球贸易中心', '时代广场', '金茂大厦', '万象城', '恒隆广场', '银泰中心', '万达广场', '合生汇'],
  residential: ['阳光花园', '绿城公寓', '滨江小区', '翠湖天地', '御景园', '华府天地', '观澜府', '悦湖湾'],
  office: ['科技大厦', '创新中心', '软件园A座', '金融街1号', '总部大楼', '商务中心', '国际大厦', '企业天地']
};

function generateBuildings() {
  const buildings = [];
  const gridSize = 5;
  const spacing = 12;
  let id = 0;

  for (let x = -gridSize; x <= gridSize; x++) {
    for (let z = -gridSize; z <= gridSize; z++) {
      if (Math.random() > 0.3) {
        const type = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
        const names = buildingNames[type];
        const baseHeight = type === 'office' ? 15 : type === 'commercial' ? 12 : 8;
        const height = baseHeight + Math.random() * 15;
        const floors = Math.floor(height / 3);
        
        buildings.push({
          id: id++,
          name: names[Math.floor(Math.random() * names.length)] + (id % 5 === 0 ? ` ${Math.ceil(id / 5)}期` : ''),
          type,
          position: [x * spacing + (Math.random() - 0.5) * 2, 0, z * spacing + (Math.random() - 0.5) * 2],
          size: [3 + Math.random() * 2, height, 3 + Math.random() * 2],
          floors,
          energyConsumption: Math.floor(500 + Math.random() * 2000),
          occupancy: Math.floor(70 + Math.random() * 30),
          yearBuilt: 2000 + Math.floor(Math.random() * 24),
          color: type === 'commercial' ? '#ff6b6b' : type === 'residential' ? '#4ecdc4' : '#45b7d1'
        });
      }
    }
  }

  return buildings;
}

export const buildingsData = generateBuildings();

export const typeLabels = {
  all: '全部建筑',
  commercial: '商业建筑',
  residential: '住宅建筑',
  office: '办公建筑'
};

export const typeColors = {
  commercial: '#ff6b6b',
  residential: '#4ecdc4',
  office: '#45b7d1'
};
