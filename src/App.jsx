import { Routes, Route } from "react-router-dom";
import "./App.css";
import Habits from "./pages/habits";
import Tasks from "./pages/tasks";
import Stats from "./pages/stats";
import TopNavBar from "./comps/topnav";
import BottomNav from "./comps/bottomnav";



export default function App() {
  return (
    <div className="app-layout">
      <TopNavBar />
      <div className="page-layout">
        <Routes>
          <Route path="/" element={<Habits />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/stats" element={<Stats/>} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  );
}