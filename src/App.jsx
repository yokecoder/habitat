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
        <div className="app-shell">
            <TopNavBar />
            <main className="page-layout">
                <Routes>
                    <Route path="/" element={<Habits />} />
                    <Route path="/home" element={<Habits />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/stats" element={<Stats />} />
                    <Route path="/analytics" element={<Stats />} />
                </Routes>
            </main>
            <BottomNav />
            <ToastContainer
                position="top-center"
                autoClose={900}
                hideProgressBar
                closeButton={false}
                toastStyle={{
                    backgroundColor: "var(--panel-bg)",
                    color: "var(--text-primary)",
                    borderRadius: "14px",
                    padding: "12px 14px",
                    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)"
                }}
            />
        </div>
    );
}
