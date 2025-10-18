import React, { useState } from "react";
import { Button, Select, MenuItem } from "@mui/material";
import { TextField, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NumbersIcon from "@mui/icons-material/Numbers";
import TimerIcon from "@mui/icons-material/Timer";
import IconButton from "@mui/material/IconButton";
import useHabitStore from "../utils/habitlist";
import HabitCard from "../comps/habitcard";

/* Component:: <Habits />
 ** Represents Habits Page Section of the site
 */
export default function Habits() {
    const [showAddHabit, setShowAddHabit] = useState(false);
    const { habits, getHabitById } = useHabitStore();

    return (
        <div className="habits">
            <Button
                startIcon={<AddIcon />}
                variant="outlined"
                className="add-hbt-btn"
                onClick={() => setShowAddHabit(!showAddHabit)}
            >
                Add Habit
            </Button>

            {showAddHabit && (
                <AddHabit
                    onCancel={() => setShowAddHabit(false)}
                    onadd={() => setShowAddHabit(false)}
                />
            )}

            <div className="habits-list">
                {habits.length === 0 && <p> No Habits Added Yet</p>}
                {habits.length > 0 &&
                    habits.map(h => <HabitCard key={h.id} id={h.id} />)}
            </div>
        </div>
    );
}

/*Component:: <AddHabit /> 
    Params:
        * onadd :: callback function for adding  habit
        * onCancel :: callback function for Close Button 
    ** Provides UI & functionality for Adding a New Habit
*/
export function AddHabit({ onadd, onCancel }) {
    const [habitTitle, setHabitTitle] = useState("");
    const [goalType, setGoalType] = useState("routine"); //goaltypes: task, count, time
    const [goalCount, setGoalCount] = useState(1);
    const [goalTime, setGoalTime] = useState("00:05");
    const { addHabit } = useHabitStore();

    const handleAdd = () => {
        if (habitTitle === "") {
            return;
        }

        let goalValue = null;
        if (goalType === "count") {
            goalValue = goalCount;
        } else if (goalType === "time") {
            goalValue = goalTime;
        }

        let hbtData = {
            habitTitle,
            goalType,
            goalValue,
            status: null
        };
        addHabit(hbtData);
    };

    return (
        <div className="add-habits-pg">
            <div>
                <div className="title-text">New Habit</div>
                <input
                    className="inputbox"
                    type="text"
                    label="New Habit"
                    placeholder="Habit"
                    value={habitTitle}
                    onChange={e => setHabitTitle(e.target.value)}
                />
            </div>

            <div>
                <div className="title-text"> Set Goal </div>
                <div className="habit-goal-options">
                    <Button
                        variant="outlined"
                        className="btn-outlined"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => setGoalType("routine")}
                    >
                        Routine
                    </Button>
                    <Button
                        variant="outlined"
                        className="btn-outlined"
                        startIcon={<NumbersIcon />}
                        onClick={() => setGoalType("count")}
                    >
                        Count
                    </Button>
                    <Button
                        variant="outlined"
                        className="btn-outlined"
                        startIcon={<TimerIcon />}
                        onClick={() => setGoalType("time")}
                    >
                        Time
                    </Button>
                </div>
            </div>

            <div className="habit-goal-input">
                {goalType === "count" && (
                    <div className="goal-count">
                        <input
                            type="number"
                            min="1"
                            max="100"
                            className="inputbox2"
                            placeholder="Count"
                            value={goalCount}
                            onChange={e => setGoalCount(e.target.value)}
                        />
                        <label className="title-text">time(s)</label>
                    </div>
                )}
                {/*Todo: Timer Input Design */}
                {/* {goalType === "time" && (
                    <Stack direction="row" space={1} alignItems="center">
                        <input
                            type="number"
                            min={0}
                            max={59}
                            placeholder="Hours"
                        />
                        <input
                            type="number"
                            min={0}
                            max={59}
                            placeholder="Minutes"
                        />
                    </Stack>
                )}*/}
            </div>

            {/*Todo: Repeatability Selection option*/}
            {/* }<div className="repeatability-option">
                <span className="title-text">Repeatability</span>
                <div>Selected Weekdays</div>
            </div>*/}

            <div className="actions">
                <Button
                    variant="outlined"
                    className="btn-outlined"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    className="btn"
                    onClick={() => {
                        handleAdd();
                        onadd();
                    }}
                >
                    Add Habit
                </Button>
            </div>
        </div>
    );
}
