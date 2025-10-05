import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ChecklistIcon from "@mui/icons-material/Checklist";
import BarChartIcon from "@mui/icons-material/BarChart";

export default function BottomNav() {
  
  
  return (
    <div className="bottomnav" >
      <Link className="link nav" to="/">
        <HomeIcon  />
      </Link>
      <Link className="link nav" to="/tasks">
        <ChecklistIcon  />
      </Link>
      <Link className="link nav" to="/stats">
        <BarChartIcon  />
      </Link>
    </div>
  );
}