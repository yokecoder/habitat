import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardActions, dividerClasses } from "@mui/material";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import useHabitStore from "../utils/habitlist";
import { ViewHabit } from "../pages/habits";
import { useState } from "react";

export default function HabitCard({ id }) {
  const [viewHabit, setViewHabit] = useState(false);
  const { getHabitById } = useHabitStore();
  const currHabit = getHabitById(id);

  return (
    <>
      <Card className="habitcard">
        <CardContent onClick={() => setViewHabit(true)}>
          <Typography variant="h6">{currHabit.habitTitle}</Typography>
          {currHabit.habitDescription && (
            <Typography variant="body">{currHabit.habitDescription}</Typography>
          )}

          <Typography variant="body2">
            {currHabit.goalValue}
            {currHabit.goalType === "amount" ? <span> times</span> : ""}
          </Typography>
        </CardContent>

        <CardActions>
          {currHabit.status === true && <div> completed </div>}
          {currHabit.status === false && <div> skipped </div>}
          {currHabit.status === null && (
            <>
              <CheckCircleIcon />
              <CancelIcon />
            </>
          )}
        </CardActions>
      </Card>
      {viewHabit && (
        <ViewHabit habitId={id} onClose={() => setViewHabit(false)} />
      )}
    </>
  );
}
