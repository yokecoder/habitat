import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import { Button, Select, MenuItem } from "@mui/material";
import useHabitStore from "../utils/habitlist";
import HabitCard from "../comps/habitcard";

export default function Habits() {
  const [showAddHabit, setShowAddHabit] = useState(false);
  const { habits, getHabitById } = useHabitStore();

  return (
    <div className="habits">
      <Button
        startIcon={<AddIcon />}
        variant="contained"
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
        {habits && habits.map((h) => <HabitCard key={h.id} id={h.id} />)}
      </div>
    </div>
  );
}

{
  /* component which provides ui for adding habits */
}
export function AddHabit({ onadd, onCancel }) {
  const [habitTitle, setHabitTitle] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [goalType, setGoalType] = useState("task");
  const [goalAmt, setGoalAmt] = useState(1);
  const [goalTime, setGoalTime] = useState("");
  const { addHabit } = useHabitStore();

  const handleAdd = () => {
    if (habitTitle === "") {
      return;
    }

    let goalValue = null;
    if (goalType === "amount") {
      goalValue = goalAmt;
    } else if (goalType === "time") {
      goalValue = goalTime;
    }

    let hbtData = {
      habitTitle,
      habitDescription,
      goalType,
      goalValue,
      status: null,
    };
    addHabit(hbtData);
  };

  return (
    <div className="add-habits-pg">
      <h2>Add a New Habit</h2>

      <div className="input-control">
        <input
          type="text"
          placeholder="Habit"
          className="inputbox"
          value={habitTitle}
          onChange={(e) => setHabitTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="inputbox"
          value={habitDescription}
          onChange={(e) => setHabitDescription(e.target.value)}
        />
      </div>
      <div className="goaltype">
        <div className="type-opt-btns">
          <Button
            className="btn-outlined goal-opt-btn"
            variant="outlined"
            onClick={() => setGoalType("task")}
          >
            task
          </Button>
          <Button
            className="btn-outlined goal-opt-btn"
            variant="outlined"
            onClick={() => setGoalType("amount")}
          >
            amount
          </Button>
          <Button
            className="btn-outlined goal-opt-btn"
            variant="outlined"
            onClick={() => setGoalType("time")}
          >
            time
          </Button>
        </div>

        {goalType === "amount" && (
          <div>
            <input
              type="number"
              min={0}
              max={100}
              className="slt-goal-inp"
              placeholder="amount"
              value={goalAmt}
              onChange={(e) => setGoalAmt(e.target.value)}
            />
            <span className="amt-label">times</span>
          </div>
        )}
        {goalType === "time" && (
          <input
            type="timer"
            className="slt-goal-inp"
            placeholder="time"
            value={goalTime}
            onChange={(e) => setGoalTime(e.target.value)}
          />
        )}
      </div>

      <div className="actions">
        <Button variant="outlined" className="btn-outlined" onClick={onCancel}>
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
          Add
        </Button>
      </div>
    </div>
  );
}

export function ViewHabit({ habitId, onClose }) {
  const { getHabitById, removeHabit } = useHabitStore();

  const currentHabit = getHabitById(habitId);
  return (
    <div className="view-habits-pg">
      <span className="title">{currentHabit.habitTitle}</span>
      {currentHabit.habitDescription && (
        <span className="description">{currentHabit.habitDescription}</span>
      )}
      {currentHabit.goalType === "amount" ? (
        <span className="goal">{currentHabit.goalValue} times</span>
      ) : (
        ""
      )}

      <div className="action-btns">
        <Button onClick={onClose} className="btn">
          Close
        </Button>
        <Button className="btn">Edit Habit</Button>
        <Button className="btn" onClick={() => removeHabit(habitId)}>
          Delete Habit
        </Button>
      </div>
    </div>
  );
}
