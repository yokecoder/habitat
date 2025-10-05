import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ChecklistIcon from "@mui/icons-material/Checklist";
import BarChartIcon from "@mui/icons-material/BarChart";

export default function BottomNav() {
  const handleClick = (e) => {
    // Only proceed if a link (<a>) is clicked
    const link = e.target.closest("a");
    if (!link) return;

    // Remove 'active' class from all sibling links
    const parent = link.parentElement;
    parent.querySelectorAll("a").forEach((el) => el.classList.remove("active"));

    // Add 'active' class to clicked link
    link.classList.add("active");
  };

  return (
    <div className="bottomnav" onClick={handleClick}>
      <Link className="link nav" to="/">
        <HomeIcon className="icon" />
      </Link>
      <Link className="link nav" to="/tasks">
        <ChecklistIcon className="icon" />
      </Link>
      <Link className="link nav" to="/stats">
        <BarChartIcon className="icon" />
      </Link>
    </div>
  );
}