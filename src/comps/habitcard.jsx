import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { ViewHabit } from "../pages/habits";
import { useState } from "react";

export default function HabitCard({ id, title, desc, goaltype, goalValue }) {
  const [viewHabit, setViewHabit] = useState(false);

  return (
    <>
      <Card className="habitcard" onClick={() => setViewHabit(true)}>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          {desc && <Typography variant="body">{desc}</Typography>}
          <Typography variant="body2">
            {goalValue} {goaltype === "amount" ? <span>times</span> : ""}
          </Typography>
        </CardContent>
      </Card>
      {viewHabit && (
        <ViewHabit habitId={id} onClose={() => setViewHabit(false)} />
      )}
    </>
  );
}
