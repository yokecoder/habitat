import { Routes, Route } from "react-router-dom";
import "./App.css";
import Habits from "./pages/habits";
import Tasks from "./pages/tasks";
import Stats from "./pages/stats";
import TopNavBar from "./comps/topnav";
import BottomNav from "./comps/bottomnav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <div className="app-layout">
      <TopNavBar />
      <div className="page-layout">
        <Routes>
          <Route path="/" element={<Habits />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
      <BottomNav />
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
