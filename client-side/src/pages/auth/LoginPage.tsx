import { useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import { useAuthLogin } from "../../hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const { login, isLoading } = useAuthLogin()
  const navigate = useNavigate()
  const handleLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      await login(email, password);
      setEmail('')
      setPassword('')
      navigate('/home')
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="name">Email</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <button type="submit" disabled={isLoading}>Login</button>
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
