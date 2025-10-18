import { NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ChecklistIcon from "@mui/icons-material/Checklist";
import BarChartIcon from "@mui/icons-material/BarChart";

/*Component:: <BottomNav/>
    ** Provides UI and Functionality for Bottom Navigation
    for Habitat Application
    ** Allows users to Navigate through Application Seamlessly
*/
export default function BottomNav() {
    return (
        <div className="bottomnav">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive ? "link nav active" : "link nav"
                }
            >
                <HomeIcon className="" />
            </NavLink>

            <NavLink
                to="/tasks"
                className={({ isActive }) =>
                    isActive ? "link nav active" : "link nav"
                }
            >
                <ChecklistIcon className="" />
            </NavLink>

            <NavLink
                to="/stats"
                className={({ isActive }) =>
                    isActive ? "link nav active" : "link nav"
                }
            >
                <BarChartIcon className="" />
            </NavLink>
        </div>
    );
}
