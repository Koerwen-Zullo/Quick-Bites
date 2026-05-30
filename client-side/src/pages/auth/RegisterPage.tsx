import { useNavigate } from "react-router-dom";
export default function RegisterPage() {

    const navigate = useNavigate()
    const handleRegister = () => {
        navigate('/auth/login')
    }
    return (
        <>
            <h1>Register</h1>
            <button onClick={() => { handleRegister }}>Register</button>
        </>

    )
}