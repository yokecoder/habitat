import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import useTheme from "../utils/theme";
import IconButton from "@mui/material/IconButton";
import TitleIconImage from "../../assets/IMG_20251005_140119.png";

/*Component:: <TopNavBar />
    ** Provides UI and Functionality for Top Navigation 
    ** Represents app logo & title
    ** allows users to switch themes
*/
export default function TopNavBar() {
    const { theme, toggleTheme } = useTheme();
    return (
        <>
            <div className="topnavbar">
                <div className="title">
                    <img src={TitleIconImage} className="title-icon" alt="al" />
                    <span className="title-text">Habitat</span>
                </div>
                <IconButton className="icon" onClick={toggleTheme}>
                    {theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
            </div>
        </>
    );
}
