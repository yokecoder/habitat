import { NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ChecklistIcon from "@mui/icons-material/Checklist";
import BarChartIcon from "@mui/icons-material/BarChart";

export default function BottomNav() {
    return (
        <nav className="bottomnav">
            <NavLink to="/" className={({ isActive }) => (isActive ? "nav active" : "nav")}>
                <HomeIcon fontSize="small" />
                <span>Home</span>
            </NavLink>

            <NavLink to="/tasks" className={({ isActive }) => (isActive ? "nav active" : "nav")}>
                <ChecklistIcon fontSize="small" />
                <span>Tasks</span>
            </NavLink>

            <NavLink to="/analytics" className={({ isActive }) => (isActive ? "nav active" : "nav")}>
                <BarChartIcon fontSize="small" />
                <span>Stats</span>
            </NavLink>
        </nav>
    );
}
