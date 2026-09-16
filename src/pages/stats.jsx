import { useMemo } from "react";
import useHabitStore, { computeStreaks } from "../utils/habitlist";

const todayKey = () => new Date().toISOString().slice(0, 10);

const shiftDate = (dateKey, deltaDays) => {
    const date = new Date(`${dateKey}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + deltaDays);
    return date.toISOString().slice(0, 10);
};

const recentDays = count => {
    const today = todayKey();
    return Array.from({ length: count }, (_, index) => shiftDate(today, index - (count - 1)));
};

const formatDay = dateKey => new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC"
}).format(new Date(`${dateKey}T00:00:00Z`));

const habitStatusForDate = (habit, date) => {
    if (date === todayKey() && habit.status !== null && habit.status !== undefined) {
        return habit.status;
    }

    return habit.history?.find(entry => entry.date === date)?.status ?? null;
};

export default function Stats() {
    const { habits, tasks } = useHabitStore();
    const days = useMemo(() => recentDays(7), []);

    const habitStats = useMemo(() => habits.map(habit => {
        const history = [
            ...(habit.history || []),
            ...(habit.status !== null && habit.status !== undefined
                ? [{ date: todayKey(), status: habit.status }]
                : [])
        ];
        const completedDays = history.filter(entry => entry.status === true).length;
        const missedDays = history.filter(entry => entry.status === false).length;
        const trackedDays = completedDays + missedDays;
        const { currentStreak, bestStreak } = computeStreaks(habit);

        return {
            ...habit,
            completedDays,
            missedDays,
            trackedDays,
            completionRate: trackedDays ? Math.round((completedDays / trackedDays) * 100) : 0,
            currentStreak,
            bestStreak
        };
    }), [habits]);

    const taskDays = useMemo(() => days.map(date => {
        const completed = tasks.filter(task =>
            task.completionHistory?.some(entry => entry.date === date && entry.done)
        ).length;
        const scheduled = tasks.filter(task => (task.createdAt || date) <= date).length;

        return {
            date,
            completed,
            scheduled,
            completionRate: scheduled ? Math.round((completed / scheduled) * 100) : 0
        };
    }), [days, tasks]);

    const completedHabits = habits.filter(habit => habit.status === true).length;
    const trackedHabitDays = habitStats.reduce((total, habit) => total + habit.trackedDays, 0);
    const completedHabitDays = habitStats.reduce((total, habit) => total + habit.completedDays, 0);
    const habitProgress = habits.length ? Math.round((completedHabits / habits.length) * 100) : 0;
    const overallHabitRate = trackedHabitDays ? Math.round((completedHabitDays / trackedHabitDays) * 100) : 0;
    const completedTasks = tasks.filter(task => task.done).length;
    const totalTaskCompletions = tasks.reduce(
        (total, task) => total + (task.completionHistory || []).filter(entry => entry.done).length,
        0
    );
    const taskProgress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

    const { longestCurrentStreak, longestBestStreak } = useMemo(() => {
        if (habitStats.length === 0) {
            return { longestCurrentStreak: 0, longestBestStreak: 0 };
        }
        return {
            longestCurrentStreak: Math.max(...habitStats.map(habit => habit.currentStreak)),
            longestBestStreak: Math.max(...habitStats.map(habit => habit.bestStreak))
        };
    }, [habitStats]);

    const hasActivity = habits.length > 0 || tasks.length > 0;

    return (
        <div className="stats-page">
            <header className="page-header">
                <div>
                    <h1>Analytics</h1>
                    <span>Performance snapshot</span>
                </div>
            </header>

            {!hasActivity ? (
                <div className="empty-state">
                    <strong>Your progress story hasn't started yet.</strong>
                    <p>Add a habit or a task to see it reflected here.</p>
                </div>
            ) : (
                <>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="label">Today's habits</span>
                            <span className="value">{habitProgress}%</span>
                            <span className="detail">{completedHabits} of {habits.length} complete</span>
                        </div>
                        <div className="stat-card">
                            <span className="label">Today's tasks</span>
                            <span className="value">{taskProgress}%</span>
                            <span className="detail">{completedTasks} of {tasks.length} complete</span>
                        </div>
                        <div className="stat-card">
                            <span className="label">Current streak</span>
                            <span className="value">{longestCurrentStreak}</span>
                            <span className="detail">longest active run, days</span>
                        </div>
                        <div className="stat-card">
                            <span className="label">All-time best</span>
                            <span className="value">{longestBestStreak}</span>
                            <span className="detail">days, any habit</span>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="panel-heading">
                            <div>
                                <h3>Overall rhythm</h3>
                                <p>Long-term completion across your recorded days.</p>
                            </div>
                            <strong className="panel-kicker">{overallHabitRate}% habits</strong>
                        </div>
                        <div className="progress-list">
                            <div className="progress-item">
                                <div className="progress-row">
                                    <span>Habit check-ins</span>
                                    <strong>{completedHabitDays}/{trackedHabitDays}</strong>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${overallHabitRate}%` }} />
                                </div>
                            </div>

                            <div className="progress-item">
                                <div className="progress-row">
                                    <span>Task completions logged</span>
                                    <strong>{totalTaskCompletions}</strong>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill task-fill" style={{ width: `${taskProgress}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="panel-heading">
                            <div>
                                <h3>Habit analysis</h3>
                                <p>Completion, streaks, and the last seven days for each habit.</p>
                            </div>
                        </div>
                        <div className="habit-analysis-list">
                            {habitStats.map(habit => (
                                <article className="habit-analysis" key={habit.id}>
                                    <div className="habit-analysis-header">
                                        <div>
                                            <strong>{habit.habitTitle}</strong>
                                            <span>{habit.completedDays} completed · {habit.missedDays} missed</span>
                                        </div>
                                        <strong className="analysis-rate">{habit.completionRate}%</strong>
                                    </div>
                                    <div className="habit-day-strip" aria-label={`Last seven days for ${habit.habitTitle}`}>
                                        {days.map(date => {
                                            const status = habitStatusForDate(habit, date);
                                            return (
                                                <span className={`habit-day ${status === true ? "done" : status === false ? "missed" : "empty"}`} key={date} title={`${formatDay(date)}: ${status === true ? "completed" : status === false ? "missed" : "not tracked"}`}>
                                                    <small>{new Intl.DateTimeFormat(undefined, { weekday: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)).slice(0, 1)}</small>
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <div className="analysis-meta">
                                        <span>{habit.currentStreak} day current streak</span>
                                        <span>{habit.bestStreak} day best streak</span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="panel">
                        <div className="panel-heading">
                            <div>
                                <h3>Task completion by day</h3>
                                <p>Completion activity across the last seven days.</p>
                            </div>
                        </div>
                        <div className="task-day-list">
                            {taskDays.map(day => (
                                <div className="task-day-row" key={day.date}>
                                    <div className="task-day-label">
                                        <strong>{formatDay(day.date)}</strong>
                                        <span>{day.completed}/{day.scheduled || 0} complete</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill task-fill" style={{ width: `${day.completionRate}%` }} />
                                    </div>
                                    <strong className="task-day-rate">{day.completionRate}%</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
