import { create } from "zustand";
import { toast } from "react-toastify";

const generateId = () => Math.random().toString(36).slice(2, 10);

const readStorage = (key, fallback) => {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
};

const writeStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const defaultTasks = [
    { id: "task-1", title: "Review daily goals", done: false },
    { id: "task-2", title: "Drink water", done: true },
    { id: "task-3", title: "Stretch for 10 minutes", done: false }
];

const useHabitStore = create((set, get) => ({
    habits: readStorage("habitat_habits", []),
    tasks: readStorage("habitat_tasks", defaultTasks),

    addHabit: habitData =>
        set(state => {
            const updated = [{ id: generateId(), ...habitData }, ...state.habits];
            writeStorage("habitat_habits", updated);
            toast("Habit added");
            return { habits: updated };
        }),

    removeHabit: id =>
        set(state => {
            const updated = state.habits.filter(habit => habit.id !== id);
            writeStorage("habitat_habits", updated);
            toast("Habit deleted");
            return { habits: updated };
        }),

    updateStatus: (id, status) =>
        set(state => {
            const updated = state.habits.map(habit =>
                habit.id === id ? { ...habit, status } : habit
            );
            writeStorage("habitat_habits", updated);
            return { habits: updated };
        }),

    getHabitById: id => {
        const { habits } = get();
        return habits.find(habit => habit.id === id) || null;
    },

    addTask: taskData =>
        set(state => {
            const updated = [{ id: generateId(), ...taskData }, ...state.tasks];
            writeStorage("habitat_tasks", updated);
            return { tasks: updated };
        }),

    toggleTask: id =>
        set(state => {
            const updated = state.tasks.map(task =>
                task.id === id ? { ...task, done: !task.done } : task
            );
            writeStorage("habitat_tasks", updated);
            return { tasks: updated };
        })
}));

export default useHabitStore;
