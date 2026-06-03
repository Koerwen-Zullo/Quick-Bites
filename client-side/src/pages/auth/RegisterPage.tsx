import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthRegister } from "../../hooks/useAuth";
export default function RegisterPage() {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [contactNumber, setContactNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { register, isLoading } = useAuthRegister();
    const navigate = useNavigate()

    const handleRegister = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            await register(firstName, lastName, email, contactNumber, password);
            setFirstName('');
            setLastName('');
            setEmail('');
            setContactNumber('');
            setPassword('');
            navigate("/auth/login");
        } catch (err) {
            console.log(err);

        }
    }

    return (
        <>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} />
                <input type="text" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} />
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="tel" placeholder="Contact Number" onChange={(e) => setContactNumber(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" disabled={isLoading}>Register</button>
            </form>
        </>

    )
}