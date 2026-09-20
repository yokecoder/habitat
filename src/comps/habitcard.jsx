import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useHabitStore from "../utils/habitlist";

const todayKey = () => new Date().toISOString().slice(0, 10);

const shiftDate = (dateKey, deltaDays) => {
    const date = new Date(`${dateKey}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + deltaDays);
    return date.toISOString().slice(0, 10);
};

const formatDate = dateKey => new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC"
}).format(new Date(`${dateKey}T00:00:00Z`));

const initials = title =>
    (title || "?")
        .trim()
        .slice(0, 2)
        .toUpperCase();

export default function HabitCard({ id, onEdit }) {
    const [expanded, setExpanded] = useState(false);
    const { getHabitById, updateStatus, removeHabit, getStreaks } = useHabitStore();
    const habit = getHabitById(id);

    if (!habit) return null;

    const { currentStreak, bestStreak } = getStreaks(id);
    const trackingDays = [
        { label: "Today", date: todayKey() },
        { label: "Yesterday", date: shiftDate(todayKey(), -1) },
        { label: "2 days ago", date: shiftDate(todayKey(), -2) }
    ];

    const statusForDate = date => date === todayKey()
        ? habit.status
        : habit.history?.find(entry => entry.date === date)?.status;

    const goalLabel =
        habit.goalType === "count"
            ? `Target ${habit.goalValue}\u00d7`
            : habit.goalType === "time"
                ? `Target ${habit.goalValue}`
                : "Daily routine";

    const statusClass =
        habit.status === true ? "done" : habit.status === false ? "missed" : "pending";

    return (
        <article className={`habit-card ${statusClass === "done" ? "is-done" : ""}`}>
            <div className="habit-card-inner">
                <div className="habit-card-top">
                    <div className="habit-icon" aria-hidden="true">
                        {initials(habit.habitTitle)}
                    </div>

                    <div className="habit-card-main">
                        <h3 className="habit-card-title">{habit.habitTitle}</h3>
                        <div className="habit-card-meta">
                            <span className="goal-pill">{goalLabel}</span>
                            <span className="streak-pill">
                                <LocalFireDepartmentIcon style={{ fontSize: 14 }} />
                                {currentStreak} day streak
                            </span>
                            <span className={`status-pill ${statusClass}`}>
                                {habit.status === true
                                    ? "Done"
                                    : habit.status === false
                                        ? "Missed"
                                        : "Pending"}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="small-icon-btn expand-btn"
                        onClick={() => setExpanded(!expanded)}
                        aria-label={expanded ? "Hide habit details" : "Show habit details"}
                        aria-expanded={expanded}
                    >
                        <ExpandMoreIcon
                            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
                        />
                    </button>
                </div>

                <div className="habit-card-actions">
                    <div className="habit-log">
                        <div className="habit-tracking-days">
                        {trackingDays.map(day => {
                            const status = statusForDate(day.date);
                            return (
                                <div className="habit-tracking-day" key={day.date}>
                                    <span className="habit-day-label">{day.label}</span>
                                    <span className="habit-day-date">{formatDate(day.date)}</span>
                                    <span className={`habit-day-status ${status === true ? "done" : status === false ? "missed" : "pending"}`}>
                                        {status === true ? "Done" : status === false ? "Missed" : "Pending"}
                                    </span>
                                    <div className="habit-button-row">
                                        <button
                                            type="button"
                                            className={`small-icon-btn success ${status === true ? "is-active" : ""}`}
                                            onClick={() => updateStatus(id, true, day.date)}
                                            aria-label={`Mark ${day.label.toLowerCase()} as done`}
                                            aria-pressed={status === true}
                                        >
                                            <CheckIcon fontSize="small" />
                                        </button>
                                        <button
                                            type="button"
                                            className={`small-icon-btn danger ${status === false ? "is-active" : ""}`}
                                            onClick={() => updateStatus(id, false, day.date)}
                                            aria-label={`Mark ${day.label.toLowerCase()} as missed`}
                                            aria-pressed={status === false}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        </div>
                    </div>

                    <div className="habit-card-footer">
                        <span className="habit-best-streak">Best: {bestStreak} {bestStreak === 1 ? "day" : "days"}</span>
                        <div className="habit-button-row">
                        <button
                            type="button"
                            className="ghost-btn icon-only"
                            onClick={() => onEdit?.(habit)}
                            aria-label="Edit habit"
                        >
                            <EditOutlinedIcon fontSize="small" />
                        </button>
                        <button
                            type="button"
                            className="ghost-btn icon-only danger-text"
                            onClick={() => removeHabit(id)}
                            aria-label="Delete habit"
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </button>
                        </div>
                    </div>
                </div>
            </div>

            {expanded && (
                <div className="habit-details">
                    {habit.habitDescription ? <p>{habit.habitDescription}</p> : <p>No description added yet.</p>}

                    <div className="detail-grid">
                        <div className="detail-box">
                            <span className="label">Current streak</span>
                            <strong>{currentStreak} {currentStreak === 1 ? "day" : "days"}</strong>
                        </div>
                        <div className="detail-box">
                            <span className="label">Best streak</span>
                            <strong>{bestStreak} {bestStreak === 1 ? "day" : "days"}</strong>
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}
