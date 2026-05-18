export const BUILDING_TYPES = {
  commercial: { label: '商业', color: '#ff9a3c' },
  residential: { label: '住宅', color: '#4cc9f0' },
  office: { label: '办公', color: '#b84dff' }
}

const TYPE_POOL = ['commercial', 'residential', 'office']

export function generateBuildings() {
  const buildings = []
  const gridSize = 8
  const spacing = 6
  const names = ['星河大厦', '云端中心', '天禧广场', '恒远花园', '启明公寓', '科创园', '金融中心', '万象城', '卓越阁', '中环大厦', '锦绣家园', '金鼎湾', '天际大厦', '蓝天郡', '翠湖名邸', '阳光100', '金色家园', '城市之光', '万达广场', '碧桂园', '万科城', '华润大厦', '龙湖天街', '保利花园', '恒大名都', '绿地中心', '中海紫御', '世茂广场', '融创玖园', '招商蛇口']
  let idx = 0
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if ((i === 3 || i === 4) && (j === 3 || j === 4)) continue
      const type = TYPE_POOL[Math.floor(Math.random() * 3)]
      const height = 2 + Math.random() * 8 + (type === 'office' ? 2 : 0)
      const floors = Math.floor(height * 3 + 5)
      buildings.push({
        id: `b-${idx}`,
        name: names[idx % names.length] + (idx >= names.length ? ' ' + Math.floor(idx / names.length + 1) : ''),
        type,
        position: [(i - gridSize / 2 + 0.5) * spacing, height / 2, (j - gridSize / 2 + 0.5) * spacing],
        size: [2.5 + Math.random() * 1.5, height, 2.5 + Math.random() * 1.5],
        floors,
        energy: Math.floor(200 + Math.random() * 800),
        occupancy: Math.floor(30 + Math.random() * 70),
        built: 1980 + Math.floor(Math.random() * 45)
      })
      idx++
    }
  }
  return buildings
}

export function generateRoads() {
  const roads = []
  const gridSize = 8
  const spacing = 6
  for (let i = 0; i <= gridSize; i++) {
    roads.push({
      id: `rh-${i}`,
      path: [
        [(-gridSize / 2) * spacing, 0.02, (i - gridSize / 2) * spacing],
        [(gridSize / 2) * spacing, 0.02, (i - gridSize / 2) * spacing]
      ]
    })
    roads.push({
      id: `rv-${i}`,
      path: [
        [(i - gridSize / 2) * spacing, 0.02, (-gridSize / 2) * spacing],
        [(i - gridSize / 2) * spacing, 0.02, (gridSize / 2) * spacing]
      ]
    })
  }
  return roads
}

export function generateCars(roads) {
  const cars = []
  roads.forEach((r, i) => {
    if (Math.random() > 0.35) return
    const count = 1 + Math.floor(Math.random() * 3)
    for (let k = 0; k < count; k++) {
      cars.push({
        id: `${r.id}-${k}`,
        roadId: r.id,
        progress: Math.random(),
        speed: 0.05 + Math.random() * 0.1,
        direction: Math.random() > 0.5 ? 1 : -1,
        path: r.path,
        color: Math.random() > 0.5 ? '#ffeb3b' : '#ff5252'
      })
    }
  })
  return cars
}
