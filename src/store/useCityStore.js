import { create } from 'zustand';
import { buildingsData } from '../data/buildings';

export const useCityStore = create((set) => ({
  buildings: buildingsData,
  selectedBuilding: null,
  filterType: 'all',
  timeOfDay: 0.5,
  isDay: true,

  setSelectedBuilding: (building) => set({ selectedBuilding: building }),
  setFilterType: (type) => set({ filterType: type }),
  setTimeOfDay: (time) => set({ timeOfDay: time, isDay: time > 0.25 && time < 0.75 }),
  toggleDayNight: () => set((state) => ({
    timeOfDay: state.isDay ? 0 : 0.5,
    isDay: !state.isDay
  }))
}));
