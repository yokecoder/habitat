import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import useHabitStore from "../utils/habitlist";

export default function Tasks() {
    const { tasks, addTask, toggleTask, updateTask, removeTask } = useHabitStore();
    const [taskTitle, setTaskTitle] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");

    const handleAddTask = () => {
        const trimmedTitle = taskTitle.trim();
        if (!trimmedTitle) return;

        addTask({ title: trimmedTitle, done: false });
        setTaskTitle("");
    };

    const doneCount = tasks.filter(task => task.done).length;

    const startEditing = task => {
        setEditingTaskId(task.id);
        setEditingTitle(task.title);
    };

    const saveEdit = () => {
        const trimmedTitle = editingTitle.trim();
        if (!trimmedTitle || !editingTaskId) return;

        updateTask(editingTaskId, trimmedTitle);
        setEditingTaskId(null);
        setEditingTitle("");
    };

    return (
        <div className="tasks-page">
            <header className="page-header">
                <div>
                    <h1>Today</h1>
                    <span>{tasks.length ? `${doneCount}/${tasks.length} complete` : "Nothing scheduled yet"}</span>
                </div>
            </header>

            <div className="task-form">
                <input
                    type="text"
                    value={taskTitle}
                    onChange={event => setTaskTitle(event.target.value)}
                    placeholder="Add a task for today"
                    aria-label="Add a task for today"
                    onKeyDown={event => {
                        if (event.key === "Enter") {
                            handleAddTask();
                        }
                    }}
                />
                <button type="button" className="primary-btn icon-only" onClick={handleAddTask} aria-label="Add task">
                    <AddIcon fontSize="small" />
                </button>
            </div>

            <div className="task-list">
                {tasks.length === 0 ? (
                    <div className="empty-state">
                        <strong>Your task list is clear.</strong>
                        <p>Add something small to keep today moving.</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <div className={`task-card ${task.done ? "is-done" : ""}`} key={task.id}>
                            <button
                                type="button"
                                className={`task-check ${task.done ? "checked" : ""}`}
                                onClick={() => toggleTask(task.id)}
                                aria-pressed={task.done}
                                aria-label={task.done ? "Mark task not done" : "Mark task done"}
                            >
                                {task.done && <CheckIcon fontSize="small" />}
                            </button>
                            {editingTaskId === task.id ? (
                                <input
                                    className="task-edit-input"
                                    value={editingTitle}
                                    onChange={event => setEditingTitle(event.target.value)}
                                    onKeyDown={event => {
                                        if (event.key === "Enter") saveEdit();
                                        if (event.key === "Escape") setEditingTaskId(null);
                                    }}
                                    aria-label="Edit task"
                                    autoFocus
                                />
                            ) : (
                                <div className="task-text">
                                    <strong style={{ textDecoration: task.done ? "line-through" : "none" }}>
                                        {task.title}
                                    </strong>
                                    <small>{task.done ? "Completed" : "Pending"}</small>
                                </div>
                            )}
                            <div className="task-actions">
                                {editingTaskId === task.id ? (
                                    <button type="button" className="ghost-btn" onClick={saveEdit}>Save</button>
                                ) : (
                                    <button
                                        type="button"
                                        className="ghost-btn icon-only"
                                        onClick={() => startEditing(task)}
                                        aria-label={`Edit ${task.title}`}
                                    >
                                        <EditOutlinedIcon fontSize="small" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="ghost-btn icon-only danger-text"
                                    onClick={() => removeTask(task.id)}
                                    aria-label={`Delete ${task.title}`}
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
