import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import useHabitStore from "../utils/habitlist";
import { useState } from "react";

/*Component :: <HabitCard />
    * Params
        * id : unique id for habit (used to fetch habit details)
    ** Presents Details of Habits in a Crisp Card like interface
    ** Allows Users to Get a Detailed view of habit of invoking 
    <viewHabit /> Component by clicking on it 
    ** Allows Users to set the status of habit
*/
export default function HabitCard({ id }) {
    const [viewHabit, setViewHabit] = useState(false);
    const { getHabitById, updateStatus } = useHabitStore();
    const currHabit = getHabitById(id);

    return (
        <>
            <Card className="habitcard">
                <CardContent
                    sx={{ width: "180px" }}
                    onClick={() => setViewHabit(true)}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            whiteSpace: "nowrap",
                            overflowX: "auto",
                            scrollbarWidth: "none", // Firefox
                            msOverflowStyle: "none", // Internet Explorer and Edge
                            "&::-webkit-scrollbar": {
                                display: "none" // Chrome, Safari, Opera
                            }
                        }}
                    >
                        {currHabit.habitTitle}
                    </Typography>
                    <Typography variant="body2">
                        {currHabit.goalType === "routine" && "routine"}
                        {currHabit.goalType === "count" &&
                            `${currHabit.goalValue} time(s)`}
                    </Typography>
                </CardContent>

                <CardActions>
                    {currHabit.status === true && (
                        <div
                            style={{
                                color: "green",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "5px"
                            }}
                        >
                            <CheckCircleIcon />
                            <span>Completed</span>
                        </div>
                    )}
                    {currHabit.status === false && (
                        <div
                            style={{
                                color: "red",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "5px"
                            }}
                        >
                            <CancelIcon />
                            <span>Skipped</span>
                        </div>
                    )}
                    {currHabit.status === null && (
                        <>
                            <CheckCircleIcon
                                className="action-icon"
                                onClick={() => updateStatus(id, true)}
                            />
                            <CancelIcon
                                className="action-icon"
                                onClick={() => updateStatus(id, false)}
                            />
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

/*Component:: <ViewHabit /> 
  PARAMS::
    * habitId: unique id of habit (used to fetch habit details based on its id)
    * onClose: callback function to close actions of the page
    
  ** Provides Detailed Information about the habit
  ** Provides Stats of the habit 
  ** allows users to make changes on their habit
*/
export function ViewHabit({ habitId, onClose }) {
    const { getHabitById, removeHabit } = useHabitStore();

    const currentHabit = getHabitById(habitId);

    return (
        <div className="view-habits-pg">
            <span className="title">{currentHabit.habitTitle}</span>
            {currentHabit.habitDescription && (
                <span className="description">
                    {currentHabit.habitDescription}
                </span>
            )}
            {currentHabit.goalType === "amount" ? (
                <span className="goal">{currentHabit.goalValue} times</span>
            ) : (
                ""
            )}

            <div className="habit-status">
                Status :
                {currentHabit.status ? (
                    <p>Completed for Today</p>
                ) : currentHabit.status === false ? (
                    <p>Skipped for Today</p>
                ) : (
                    <p>Yet to Complete</p>
                )}
            </div>
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
