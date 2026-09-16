import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useHabitStore from "../utils/habitlist";
import HabitCard from "../comps/habitcard";

const emptyDraft = {
    habitTitle: "",
    habitDescription: "",
    goalType: "routine",
    goalValue: "1"
};

export default function Habits() {
    const [open, setOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const { habits } = useHabitStore();

    const { completed, total, percent } = useMemo(() => {
        const totalCount = habits.length;
        const completedCount = habits.filter(habit => habit.status === true).length;
        return {
            completed: completedCount,
            total: totalCount,
            percent: totalCount ? Math.round((completedCount / totalCount) * 100) : 0
        };
    }, [habits]);

    const openCreate = () => {
        setEditingHabit(null);
        setOpen(true);
    };

    const openEdit = habit => {
        setEditingHabit(habit);
        setOpen(true);
    };

    return (
        <div className="habits-page">
            <header className="page-header">
                <div>
                    <h1>Habits</h1>
                    <span>Daily focus</span>
                </div>
                <button type="button" className="primary-btn" onClick={openCreate}>
                    <AddIcon fontSize="small" />
                    Add Habit
                </button>
            </header>

            {total > 0 && (
                <div className="progress-summary">
                    <div className="progress-ring" style={{ "--ring-percent": percent }}>
                        <span>{percent}%</span>
                    </div>
                    <div className="progress-summary-copy">
                        <span className="progress-summary-title">Today's progress</span>
                        <strong>{completed} / {total} habits completed</strong>
                    </div>
                </div>
            )}

            <div className="habits-list">
                {habits.length === 0 ? (
                    <div className="empty-state">
                        <strong>Your routine starts here.</strong>
                        <p>Create your first habit and give your day some structure.</p>
                        <button type="button" className="primary-btn" onClick={openCreate}>
                            <AddIcon fontSize="small" />
                            Create your first habit
                        </button>
                    </div>
                ) : (
                    habits.map(habit => (
                        <HabitCard key={habit.id} id={habit.id} onEdit={openEdit} />
                    ))
                )}
            </div>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ className: "dialog-paper" }}
            >
                <DialogContent>
                    <div className="dialog-header">
                        <h3>{editingHabit ? "Edit Habit" : "Add Habit"}</h3>
                        <IconButton onClick={() => setOpen(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </div>

                    <HabitForm
                        habit={editingHabit}
                        onClose={() => setOpen(false)}
                        onSubmit={() => setOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

function HabitForm({ habit, onClose, onSubmit }) {
    const isEditing = Boolean(habit);
    const [draft, setDraft] = useState(() =>
        isEditing
            ? {
                habitTitle: habit.habitTitle,
                habitDescription: habit.habitDescription || "",
                goalType: habit.goalType || "routine",
                goalValue: habit.goalValue != null ? String(habit.goalValue) : "1"
            }
            : emptyDraft
    );
    const { addHabit, editHabit } = useHabitStore();

    const handleSave = () => {
        const trimmedTitle = draft.habitTitle.trim();
        if (!trimmedTitle) return;

        const normalizedGoalValue =
            draft.goalType === "count"
                ? Number(draft.goalValue) || 1
                : draft.goalType === "time"
                    ? draft.goalValue
                    : null;

        const payload = {
            habitTitle: trimmedTitle,
            habitDescription: draft.habitDescription.trim(),
            goalType: draft.goalType,
            goalValue: normalizedGoalValue
        };

        if (isEditing) {
            editHabit(habit.id, payload);
        } else {
            addHabit({ ...payload, status: null });
        }

        onSubmit();
        onClose();
    };

    return (
        <div className="field-stack">
            <TextField
                label="Habit title"
                value={draft.habitTitle}
                onChange={event => setDraft({ ...draft, habitTitle: event.target.value })}
                fullWidth
                variant="outlined"
            />

            <TextField
                label="Description"
                value={draft.habitDescription}
                onChange={event => setDraft({ ...draft, habitDescription: event.target.value })}
                fullWidth
                multiline
                minRows={2}
                variant="outlined"
            />

            <div className="goal-row">
                {[
                    { key: "routine", label: "Routine" },
                    { key: "count", label: "Count" },
                    { key: "time", label: "Time" }
                ].map(option => (
                    <button
                        key={option.key}
                        type="button"
                        className={`goal-chip ${draft.goalType === option.key ? "active" : ""}`}
                        onClick={() => setDraft({ ...draft, goalType: option.key })}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {draft.goalType === "count" && (
                <TextField
                    label="Target count"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={draft.goalValue}
                    onChange={event => setDraft({ ...draft, goalValue: event.target.value })}
                    fullWidth
                    variant="outlined"
                />
            )}

            {draft.goalType === "time" && (
                <TextField
                    label="Target duration"
                    value={draft.goalValue}
                    onChange={event => setDraft({ ...draft, goalValue: event.target.value })}
                    placeholder="e.g. 20 mins"
                    fullWidth
                    variant="outlined"
                />
            )}

            <DialogActions className="dialog-actions" sx={{ padding: 0 }}>
                <button type="button" className="ghost-btn" onClick={onClose}>
                    Cancel
                </button>
                <button type="button" className="primary-btn" onClick={handleSave}>
                    {isEditing ? "Save Changes" : "Save Habit"}
                </button>
            </DialogActions>
        </div>
    );
}
