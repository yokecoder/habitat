import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

export default function  Habits () {
  
  return (
    <div className="habits">
       <Button startIcon={<AddIcon/>} variant="contained" className="add-hbt-btn"> Add Habit </Button>
    </div>
  )
  
}