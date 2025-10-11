import AddIcon from "@mui/icons-material/Add";
import React, { useState } from "react";
import { Button } from "@mui/material";
import useHabitStore from "../utils/habitlist";
import HabitCard from "../comps/habitcard";

export default function Habits() {
  const [showAddHabit, setShowAddHabit] = useState(false);
  const { habits } = useHabitStore();

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
        {habits &&
          habits.map((h) => (
            <HabitCard title={h.habitTitle} goaltype={h.goalType} />
          ))}
      </div>
    </div>
  );
}

export function AddHabit({ onadd, onCancel }) {
  const [habitTitle, setHabitTitle] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [goalType, setGoalType] = useState("task");
  const { habits, addHabit } = useHabitStore();

  const handleAdd = () => {
    if (habitTitle === "") {
      return;
    }
    let hbtData = { habitTitle, habitDescription, goalType };
    addHabit(hbtData);
  };

  return (
    <div className="add-habits-pg">
      <h2>Add a New Habit</h2>

      {/* Habit Name and Description */}
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
          <input type="text" className="inputbox" placeholder="amount" />
        )}
        {goalType === "time" && (
          <input type="text" className="inputbox" placeholder="time" />
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
