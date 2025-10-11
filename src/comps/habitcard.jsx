import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function HabitCard({ title, goaltype }) {
  return (
    <Card className="habitcard">
      <CardContent>
        <Typography variant="h6">{title}</Typography>

        <Typography variant="body2">{goaltype}</Typography>
      </CardContent>
    </Card>
  );
}
