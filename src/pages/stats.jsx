import useHabitStore from "../utils/habitlist";

export default function Stats() {
    const { habits, tasks } = useHabitStore();

    const completedHabits = habits.filter(habit => habit.status === true).length;
    const pendingHabits = habits.filter(habit => habit.status === null).length;
    const habitProgress = habits.length ? Math.round((completedHabits / habits.length) * 100) : 0;
    const completedTasks = tasks.filter(task => task.done).length;
    const taskProgress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

    return (
        <div className="stats-page">
            <header className="page-header">
                <div>
                    <h1>Analytics</h1>
                    <span>Performance snapshot</span>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="label">Habits</span>
                    <span className="value">{habits.length}</span>
                    <span className="detail">{completedHabits} completed</span>
                </div>
                <div className="stat-card">
                    <span className="label">Tasks</span>
                    <span className="value">{tasks.length}</span>
                    <span className="detail">{completedTasks} finished</span>
                </div>
            </div>

            <div className="panel">
                <h3>Progress</h3>
                <div className="progress-list">
                    <div className="progress-item">
                        <div className="progress-row">
                            <span>Habit completion</span>
                            <strong>{habitProgress}%</strong>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${habitProgress}%` }} />
                        </div>
                    </div>

                    <div className="progress-item">
                        <div className="progress-row">
                            <span>Task completion</span>
                            <strong>{taskProgress}%</strong>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${taskProgress}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="panel">
                <h3>Insights</h3>
                <ul className="insight-list">
                    <li>
                        <span>Pending habits</span>
                        <strong>{pendingHabits}</strong>
                    </li>
                    <li>
                        <span>Finished tasks</span>
                        <strong>{completedTasks}</strong>
                    </li>
                    <li>
                        <span>Overall rhythm</span>
                        <strong>{Math.max(0, Math.min(100, habitProgress + taskProgress - 20))}%</strong>
                    </li>
                </ul>
            </div>
        </div>
    );
}
