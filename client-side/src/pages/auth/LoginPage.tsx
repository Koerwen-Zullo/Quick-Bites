import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const { login, user, isAuthLoading } = useAuth();
  const navigate = useNavigate()

  if (isAuthLoading) {
    return <div>Loading...</div>
  }

  if (user) {
    navigate('/dashboard/book', { replace: true })
  }
  const handleLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      await login({ email, password });
      setEmail('')
      setPassword('')
      if (user) {
        navigate('/dashboard/book', { replace: true })
      }
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

        <button type="submit" disabled={isAuthLoading}>Login</button>
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
