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
          <img src="" alt="al" />
          <h5>Habitat</h5>
        </div>
        <IconButton className="icon" onClick={toggleTheme}> {
          theme === "dark" ? <LightModeIcon/> : <DarkModeIcon/>
        } </IconButton>
      </div>
    </>
  )
}