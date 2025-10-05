import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon  from '@mui/icons-material/DarkMode';
import useTheme from "../utils/theme";
import IconButton from '@mui/material/IconButton';


export default function TopNavBar () {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <div className="topnavbar">
        <div className="title">
          <img src="../../assets/IMG_20251005_140119.png" className="title-icon" alt="al" />
          <h4>Habitat</h4>
        </div>
        <IconButton className="icon" onClick={toggleTheme}> {
          theme === "dark" ? <LightModeIcon/> : <DarkModeIcon/>
        } </IconButton>
      </div>
    </>
  )
}