import { Routes, Route, Navigate } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes";
export default function HomePage() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/auth/login" />} />
                <Route path="/auth/*" element={<AuthRoutes />} />
            </Routes>
        </>
    );
}