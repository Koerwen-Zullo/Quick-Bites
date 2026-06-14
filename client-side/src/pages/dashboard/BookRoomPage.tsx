import { useEffect, useState } from "react";

interface roomData {
    data: {
        id: number;
        roomNumber: string;
        createdAt: string;
    }[];
}


export default function BookRoomPage() {
    const [rooms, setRooms] = useState<roomData | null>(null);

    const handleRoomData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/rooms`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch")
            }

            const resJson = await response.json();

            console.log(resJson)
            setRooms(resJson);
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
        </>
    )
}