import { create } from "zustand";
import { toast } from "react-toastify";

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
      toast("Habit Added");
      return { habits: updated };
    }),

  removeHabit: (id) =>
    set((state) => {
      const updated = state.habits.filter((h) => h.id !== id);
      saveHabits(updated);
      toast("Habit Deleted ");
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

  updateStatus: (id, status) =>
    set((state) => {
      const updated = state.habits.map((habit) =>
        habit.id === id ? { ...habit, status } : habit
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      return { habits: updated };
    }),
}));

export default useHabitStore;
