import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import useHabitStore from "../utils/habitlist";

export default function HabitCard({ id }) {
    const [expanded, setExpanded] = useState(false);
    const { getHabitById, updateStatus, removeHabit } = useHabitStore();
    const habit = getHabitById(id);

    if (!habit) return null;

    const goalLabel =
        habit.goalType === "count"
            ? `Target ${habit.goalValue} times`
            : habit.goalType === "time"
                ? `Target ${habit.goalValue}`
                : "Daily routine";

    const statusClass =
        habit.status === true ? "done" : habit.status === false ? "missed" : "pending";

    return (
        <article className="habit-card">
            <div className="habit-card-inner">
                <div className="habit-card-top">
                    <div className="habit-card-main">
                        <h3 className="habit-card-title">{habit.habitTitle}</h3>
                        <div className="habit-card-meta">
                            <span className="goal-pill">{goalLabel}</span>
                            <span className={`status-pill ${statusClass}`}>
                                {habit.status === true
                                    ? "Done"
                                    : habit.status === false
                                        ? "Missed"
                                        : "In progress"}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="small-icon-btn"
                        onClick={() => setExpanded(!expanded)}
                        aria-label="Toggle habit details"
                    >
                        <ExpandMoreIcon
                            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
                        />
                    </button>
                </div>

                <div className="habit-card-actions">
                    <div className="habit-button-row">
                        <button
                            type="button"
                            className="small-icon-btn success"
                            onClick={() => updateStatus(id, true)}
                            aria-label="Mark habit done"
                        >
                            <CheckCircleIcon fontSize="small" />
                        </button>
                        <button
                            type="button"
                            className="small-icon-btn danger"
                            onClick={() => updateStatus(id, false)}
                            aria-label="Mark habit missed"
                        >
                            <CancelIcon fontSize="small" />
                        </button>
                    </div>

                    <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => removeHabit(id)}
                    >
                        <DeleteOutlineIcon fontSize="small" />
                    </button>
                </div>
            </div>

            {expanded && (
                <div className="habit-details">
                    {habit.habitDescription ? <p>{habit.habitDescription}</p> : <p>No description added yet.</p>}

                    <div className="detail-grid">
                        <div className="detail-box">
                            <span className="label">Goal</span>
                            <strong>{goalLabel}</strong>
                        </div>
                        <div className="detail-box">
                            <span className="label">Status</span>
                            <strong>
                                {habit.status === true
                                    ? "Completed"
                                    : habit.status === false
                                        ? "Missed"
                                        : "Pending"}
                            </strong>
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}
