// src/store/driveStore.js

import { create } from 'zustand';

const useDriveStore = create((set) => ({
  drives: [],
  selectedDrive: null,
  filters: {
    search: '',
    location: '',
    type: '',
    salary: '',
    skills: [],
  },

  setDrives: (drives) => set({ drives }),

  addDrive: (drive) =>
    set((state) => ({ drives: [drive, ...state.drives] })),

  updateDrive: (id, updated) =>
    set((state) => ({
      drives: state.drives.map((d) => d.id === id ? { ...d, ...updated } : d),
    })),

  removeDrive: (id) =>
    set((state) => ({
      drives: state.drives.filter((d) => d.id !== id),
    })),

  setSelectedDrive: (drive) => set({ selectedDrive: drive }),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  resetFilters: () =>
    set({
      filters: { search: '', location: '', type: '', salary: '', skills: [] },
    }),
}));

export default useDriveStore;