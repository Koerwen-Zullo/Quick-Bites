import "../../assets/css/DashboardPage.css";
import { useEffect, useState } from "react";
const sampleData = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
    image: "https://picsum.photos/200/300",
    alt: "dog-training-dog-1",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    phone: "987-654-3210",
    image: "https://picsum.photos/200/300",
    alt: "dog-training-dog-2",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bobjohnson@example.com",
    phone: "555-555-5555",
    image: "https://picsum.photos/200/300",
    alt: "dog-training-dog-3",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alicebrown@example.com",
    phone: "444-444-4444",
    image: "https://picsum.photos/200/300",
    alt: "dog-training-dog-4",
  },
  {
    id: 5,
    name: "Charlie Davis",
    email: "charliedavis@example.com",
    phone: "333-333-3333",
    image: "https://picsum.photos/200/300",
    alt: "dog-training-dog-5",
  },
];

const addMoreItemsImgUrl =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPblBR1hoKwsZrvdOhYLSTlc51uhZT2YwhMxnlJWdaoQ&s=10";

export default function DashboardPage() {
  const [data, setData] = useState(sampleData);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const addMoreItemsImgUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPblBR1hoKwsZrvdOhYLSTlc51uhZT2YwhMxnlJWdaoQ&s=10";

  return (
    <div className="button-container">
      <div className="border-container">
        {data.map((user) => (
          <div className="inner-button-container" key={user.id}>
            <img src={user.image} alt="user-profile" className="images" />
            <button className="buttons">{user.name}</button>
          </div>
        ))}
        <br />
        <div className="add-button-container">
          <button className="add-button" onClick={() => setIsOpen(true)}>
            +
          </button>
        </div>
        <div className={`modal-container ${isOpen ? "open" : ""}`}>
          <div className="modal">
            <h2>Modal Title</h2>
            <p>modaltest</p>

            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
