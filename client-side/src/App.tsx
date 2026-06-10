import { Routes, Route, Navigate } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoutes";
import DashboardRoutes from "./routes/DashboardRoutes";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/authContext";
export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route element={<PublicRoute />}>
                <Route path="/" element={<Navigate to="/auth/login" />} />
                    <Route path="/auth/*" element={<AuthRoutes />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard/*" element={<DashboardRoutes />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
}