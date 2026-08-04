import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { authFetch } from "../../utils/authFetch";
interface roomData {
    data: {
        id: number;
        roomNumber: string;
        createdAt: string;
    }[];
}


export default function BookRoomPage() {
    const [rooms, setRooms] = useState<roomData | null>(null);

    const [isMobile, setIsMobile] = useState<boolean>(false);
    const { logout } = useAuth()
    useEffect(() => {
        const ua = navigator.userAgent;

        if (ua.includes("Mobile") || ua.includes("Android")) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }
    }, [isMobile]);


    const handleRoomData = async () => {
        try {
            const response = await authFetch("/api/auth/rooms", {
                method: "GET",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch")
            }

            const resJson = await response.json();

            setRooms(resJson);
        } catch (error) {
            console.log(error);
        }
    }

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        handleRoomData();
    }, [])

    return (
        <>
            <div>
                <h1>BookRoomPage</h1>
                <h1>isMobile: {isMobile ? "true" : "false"}</h1>
            </div>
            <div>
                <h1>show all rooms</h1>
            </div>
            <br />
            <div>
                {rooms?.data.map((room) => (
                    <div key={room.id}>
                        <p><strong>Room Number: </strong>{room.roomNumber} || <strong>Room Creation Date: </strong>{new Date(room.createdAt).toString()}</p>
                    </div>
                ))}
            </div >
            <div>
                {!rooms && <p>failed to retrieve rooms</p>}
            </div>
            <div>
                <button onClick={handleLogout}>Logout</button>
            </div>
            
        </>
    )
}