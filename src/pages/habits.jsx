import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

export default function Habits() {
  const [showAddHabit, setShowAddHabit] = useState(false);

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

      {showAddHabit && <AddHabit onCancel={() => setShowAddHabit(false)} />}

      <div className="habits-list"></div>
    </div>
  );
}

export function AddHabit({ onCancel }) {
  const [habitTitle, setHabitTitle] = useState("");
  const [habitDescription, setHabitDescription] = useState("");

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
      

      <div className="actions">
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained"> Add </Button>
      </div>
    </div>
  );
}
