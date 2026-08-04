import { Route, Routes } from "react-router-dom";
import DashboardPage from "../pages/dashboard/DashboardPage";
export default function DashboardRoutes() {
    return (
        <Routes>
            <Route path="home" element={<DashboardPage />} />
        </Routes>
    )
}