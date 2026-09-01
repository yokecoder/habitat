import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    TextField,
    IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useHabitStore from "../utils/habitlist";
import HabitCard from "../comps/habitcard";

export default function Habits() {
    const [open, setOpen] = useState(false);
    const { habits } = useHabitStore();

    return (
        <div className="habits-page">
            <header className="page-header">
                <div>
                    <h1>Habits</h1>
                    <span>Daily focus</span>
                </div>
                <Button
                    className="primary-btn"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Add Habit
                </Button>
            </header>

            <div className="habits-list">
                {habits.length === 0 ? (
                    <div className="empty-state">
                        No habits yet. Create one to begin building momentum.
                    </div>
                ) : (
                    habits.map(habit => <HabitCard key={habit.id} id={habit.id} />)
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
                        <h3>Add Habit</h3>
                        <IconButton onClick={() => setOpen(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </div>

                    <AddHabitForm
                        onClose={() => setOpen(false)}
                        onSubmit={() => setOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

function AddHabitForm({ onClose, onSubmit }) {
    const [habitTitle, setHabitTitle] = useState("");
    const [description, setDescription] = useState("");
    const [goalType, setGoalType] = useState("routine");
    const [goalValue, setGoalValue] = useState("1");
    const { addHabit } = useHabitStore();

    const handleAdd = () => {
        const trimmedTitle = habitTitle.trim();

        if (!trimmedTitle) {
            return;
        }

        const normalizedGoalValue =
            goalType === "count"
                ? Number(goalValue) || 1
                : goalType === "time"
                    ? goalValue
                    : null;

        addHabit({
            habitTitle: trimmedTitle,
            habitDescription: description.trim(),
            goalType,
            goalValue: normalizedGoalValue,
            status: null
        });

        setHabitTitle("");
        setDescription("");
        setGoalType("routine");
        setGoalValue("1");
        onSubmit();
        onClose();
    };

    return (
        <div className="field-stack">
            <TextField
                label="Habit title"
                value={habitTitle}
                onChange={event => setHabitTitle(event.target.value)}
                fullWidth
                variant="outlined"
            />

            <TextField
                label="Description"
                value={description}
                onChange={event => setDescription(event.target.value)}
                fullWidth
                multiline
                minRows={3}
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
                        className={`goal-chip ${goalType === option.key ? "active" : ""}`}
                        onClick={() => setGoalType(option.key)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {goalType === "count" && (
                <TextField
                    label="Target count"
                    type="number"
                    min="1"
                    value={goalValue}
                    onChange={event => setGoalValue(event.target.value)}
                    fullWidth
                    variant="outlined"
                />
            )}

            {goalType === "time" && (
                <TextField
                    label="Target duration"
                    value={goalValue}
                    onChange={event => setGoalValue(event.target.value)}
                    placeholder="e.g. 20 mins"
                    fullWidth
                    variant="outlined"
                />
            )}

            <DialogActions className="dialog-actions" sx={{ padding: 0 }}>
                <button type="button" className="ghost-btn" onClick={onClose}>
                    Cancel
                </button>
                <button type="button" className="primary-btn" onClick={handleAdd}>
                    Save Habit
                </button>
            </DialogActions>
        </div>
    );
}
