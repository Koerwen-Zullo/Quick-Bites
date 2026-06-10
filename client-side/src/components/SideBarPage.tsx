import { Bed } from "lucide-react";
export default function SideBarPage() {
    const sideBarItems = [
        { key: "rooms", label: 'Rooms', hint: "Rooms", Icon: Bed },
    ]

    return (
        <div>
            {sideBarItems.map((item) => (
                <div key={item.key}>
                    <item.Icon />
                    <span>{item.label}</span>
                    
                </div>
            ))}
        </div>
    )
}