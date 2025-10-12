import { create } from "zustand";

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 10);

// LocalStorage helpers
const STORAGE_KEY = "habitat_habits";
const loadHabits = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
const saveHabits = (habits) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));

// Zustand store
const useHabitStore = create((set, get) => ({
  habits: loadHabits(),

  addHabit: (habitData) =>
    set((state) => {
      const updated = [...state.habits, { id: generateId(), ...habitData }];
      saveHabits(updated);
      return { habits: updated };
    }),

  removeHabit: (id) =>
    set((state) => {
      const updated = state.habits.filter((h) => h.id !== id);
      saveHabits(updated);
      return { habits: updated };
    }),

  clearHabits: () => {
    saveHabits([]);
    set({ habits: [] });
  },

  // ✅ Fetch habit by ID
  getHabitById: (id) => {
    const { habits } = get();
    return habits.find((h) => h.id === id) || null;
  },
}));

export default useHabitStore;
