import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import useHabitStore from "../utils/habitlist";

export default function Tasks() {
    const { tasks, addTask, toggleTask } = useHabitStore();
    const [taskTitle, setTaskTitle] = useState("");

    const handleAddTask = () => {
        const trimmedTitle = taskTitle.trim();
        if (!trimmedTitle) return;

        addTask({ title: trimmedTitle, done: false });
        setTaskTitle("");
    };

    return (
        <div className="tasks-page">
            <header className="page-header">
                <div>
                    <h2>Today</h2>
                    <span>{tasks.filter(task => task.done).length}/{tasks.length} complete</span>
                </div>
            </header>

            <div className="task-form">
                <input
                    type="text"
                    value={taskTitle}
                    onChange={event => setTaskTitle(event.target.value)}
                    placeholder="Add daily task"
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                            handleAddTask();
                        }
                    }}
                />
                <button type="button" className="primary-btn" onClick={handleAddTask}>
                    <AddIcon sx={{ fontSize: 18 }} />
                </button>
            </div>

            <div className="task-list">
                {tasks.length === 0 ? (
                    <div className="empty-state">Your task list is clear.</div>
                ) : (
                    tasks.map(task => (
                        <div className="task-card" key={task.id}>
                            <div className="task-text">
                                <strong style={{ textDecoration: task.done ? "line-through" : "none" }}>
                                    {task.title}
                                </strong>
                                <small>{task.done ? "Completed" : "Pending"}</small>
                            </div>
                            <button
                                type="button"
                                className={`task-toggle-btn ${task.done ? "done" : ""}`}
                                onClick={() => toggleTask(task.id)}
                            >
                                {task.done ? "Done" : "Mark done"}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
