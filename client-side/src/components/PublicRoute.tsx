import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";
export default function PublicRoute(): React.JSX.Element {
    const { user, isAuthLoading } = useAuth();
    if (user) {
        console.log("You are authenticated");
        return <Navigate to="/dashboard/book" />;
    }
    return <Outlet />;
}