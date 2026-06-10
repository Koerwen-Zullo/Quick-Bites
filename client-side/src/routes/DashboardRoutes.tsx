import { Route, Routes } from "react-router-dom";
import BookRoomPage from "../pages/dashboard/BookRoomPage.tsx";
export default function DashboardRoutes() {
    return (
        <Routes>
            <Route path="book" element={<BookRoomPage />} />
        </Routes>
    )
}