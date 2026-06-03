import { Routes, Route, Navigate } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes";
import HomePage from "./pages/HomePage";
export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/auth/login" />} />
                <Route path="/auth/*" element={<AuthRoutes />} />
                <Route path="/home" element={<HomePage />} />
            </Routes>
        </>
    );
}