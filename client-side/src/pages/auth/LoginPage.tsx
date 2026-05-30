import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/register");
  };
  return (
    <>
      <h1>Login</h1>
      <button
        onClick={() => {
          handleLogin;
        }}
      >
        Login
      </button>
    </>
  );
}
