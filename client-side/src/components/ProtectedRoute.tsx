import { useAuth } from "../context/authContext.tsx";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute(): React.JSX.Element {
    const { user, isAuthLoading } = useAuth();
    if (isAuthLoading) {
        return <div>Loading...</div>
    }
    if (!user) {
        console.log("You are not authenticated");
        return <Navigate to="/auth/login" />
    }
    return <Outlet />;
}