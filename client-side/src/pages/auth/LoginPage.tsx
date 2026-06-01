import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();

  const { name, setName, password, setPassword } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/auth/register");
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="name">Username</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter username"
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account?
        <button type="button" onClick={() => navigate("/auth/register")}>
          Register
        </button>
      </p>
    </div>
  );
}
