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

// ---- date helpers -------------------------------------------------------

const todayKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const normalizeTasks = tasks => tasks.map(task => {
    const completionHistory = Array.isArray(task.completionHistory)
        ? task.completionHistory
        : task.done
            ? [{ date: todayKey(), done: true }]
            : [];

    return {
        ...task,
        createdAt: task.createdAt || todayKey(),
        completionHistory
    };
});

// All date-key arithmetic is done in UTC so it stays internally consistent
// regardless of the browser's local timezone offset.
const daysBetween = (a, b) => {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.round((new Date(`${b}T00:00:00Z`) - new Date(`${a}T00:00:00Z`)) / msPerDay);
};

const shiftDateKey = (dateKey, deltaDays) => {
    const date = new Date(`${dateKey}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + deltaDays);
    return date.toISOString().slice(0, 10);
};

/**
 * Rolls a habit's "today" status into its history log, then resets status
 * to null so a new day starts fresh. Only runs once per calendar day per
 * device (tracked via habitat_last_active_date). Safe no-op for habits
 * created before this field existed (history defaults to []).
 */
const rollHabitForward = (habit, fromDate) => {
    const history = Array.isArray(habit.history) ? [...habit.history] : [];

    if (habit.status !== null && habit.status !== undefined) {
        const alreadyLogged = history.some(entry => entry.date === fromDate);
        if (!alreadyLogged) {
            history.push({ date: fromDate, status: habit.status });
        }
    }

    return { ...habit, status: null, history };
};

const applyRollover = habits => {
    const lastActive = localStorage.getItem("habitat_last_active_date");
    const today = todayKey();

    if (lastActive === today) {
        return habits;
    }

    let rolled = habits;
    if (lastActive) {
        // Roll the previous active day's status into history so it isn't
        // lost when a fresh day starts.
        rolled = habits.map(habit => rollHabitForward(habit, lastActive));
    }

    localStorage.setItem("habitat_last_active_date", today);
    writeStorage("habitat_habits", rolled);
    return rolled;
};

/**
 * Current streak = consecutive completed days counting back from the most
 * recent recorded day (today if already marked done, otherwise yesterday).
 * Best streak = the longest run of consecutive completed days in history.
 */
const computeStreaks = habit => {
    const history = Array.isArray(habit.history) ? habit.history : [];
    const entries = [...history];

    if (habit.status === true) {
        entries.push({ date: todayKey(), status: true });
    }

    const doneDates = entries
        .filter(entry => entry.status === true)
        .map(entry => entry.date)
        .sort();

    if (doneDates.length === 0) {
        return { currentStreak: 0, bestStreak: 0 };
    }

    let bestStreak = 1;
    let run = 1;
    for (let i = 1; i < doneDates.length; i += 1) {
        const gap = daysBetween(doneDates[i - 1], doneDates[i]);
        run = gap === 1 ? run + 1 : 1;
        bestStreak = Math.max(bestStreak, run);
    }

    const doneSet = new Set(doneDates);
    let currentStreak = 0;
    let cursorKey = doneDates[doneDates.length - 1];
    const mostRecentGap = daysBetween(cursorKey, todayKey());

    if (mostRecentGap <= 1) {
        while (doneSet.has(cursorKey)) {
            currentStreak += 1;
            cursorKey = shiftDateKey(cursorKey, -1);
        }
    }

    return { currentStreak, bestStreak };
};

const useHabitStore = create((set, get) => ({
    habits: applyRollover(readStorage("habitat_habits", [])),
    tasks: normalizeTasks(readStorage("habitat_tasks", defaultTasks)),

    addHabit: habitData =>
        set(state => {
            const updated = [
                { id: generateId(), history: [], ...habitData },
                ...state.habits
            ];
            writeStorage("habitat_habits", updated);
            toast("Habit added");
            return { habits: updated };
        }),

    editHabit: (id, habitData) =>
        set(state => {
            const updated = state.habits.map(habit =>
                habit.id === id ? { ...habit, ...habitData } : habit
            );
            writeStorage("habitat_habits", updated);
            toast("Habit updated");
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
                habit.id === id
                    ? { ...habit, status: habit.status === status ? null : status }
                    : habit
            );
            writeStorage("habitat_habits", updated);
            return { habits: updated };
        }),

    getHabitById: id => {
        const { habits } = get();
        return habits.find(habit => habit.id === id) || null;
    },

    getStreaks: id => {
        const habit = get().getHabitById(id);
        if (!habit) return { currentStreak: 0, bestStreak: 0 };
        return computeStreaks(habit);
    },

    addTask: taskData =>
        set(state => {
            const updated = [
                {
                    id: generateId(),
                    ...taskData,
                    createdAt: taskData.createdAt || todayKey(),
                    completionHistory: taskData.completionHistory || []
                },
                ...state.tasks
            ];
            writeStorage("habitat_tasks", updated);
            return { tasks: updated };
        }),

    toggleTask: id =>
        set(state => {
            const date = todayKey();
            const updated = state.tasks.map(task => {
                if (task.id !== id) return task;

                const done = !task.done;
                const completionHistory = (task.completionHistory || [])
                    .filter(entry => entry.date !== date);

                if (done) completionHistory.push({ date, done: true });

                return { ...task, done, completionHistory };
            });
            writeStorage("habitat_tasks", updated);
            return { tasks: updated };
        }),

    updateTask: (id, title) =>
        set(state => {
            const updated = state.tasks.map(task =>
                task.id === id ? { ...task, title } : task
            );
            writeStorage("habitat_tasks", updated);
            toast("Task updated");
            return { tasks: updated };
        }),

    removeTask: id =>
        set(state => {
            const updated = state.tasks.filter(task => task.id !== id);
            writeStorage("habitat_tasks", updated);
            toast("Task deleted");
            return { tasks: updated };
        })
}));

export default useHabitStore;
export { computeStreaks };
