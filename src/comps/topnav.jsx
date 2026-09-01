import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import useTheme from "../utils/theme";
import IconButton from "@mui/material/IconButton";

export default function TopNavBar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="topnavbar">
            <div className="brand">
                <div className="brand-mark">H</div>
                <div className="brand-copy">
                    <span className="brand-subtitle">Personal growth</span>
                    <span className="title-text">Habitat</span>
                </div>
            </div>

            <IconButton
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
            >
                {theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
        </header>
    );
}
