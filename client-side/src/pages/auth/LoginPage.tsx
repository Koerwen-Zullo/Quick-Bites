import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const [messageConfirmation, setMessageConfirmation] = useState<string>("")
  const { login, user, isAuthLoading } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthLoading && user) {
      navigate("/dashboard/book", { replace: true });
    }
  }, [isAuthLoading, user, navigate]);

  if (isAuthLoading) {
    return <div>Loading...</div>
  }

  if (user) {
    return null;
  }
  const handleLogin = async (e: React.FormEvent) => {
    setMessageConfirmation('')
    try {
      e.preventDefault();
      await login({ email, password, rememberMe });
      setEmail('')
      setPassword('')
      setMessageConfirmation("Login Success")
      navigate('/dashboard/book', { replace: true })
    } catch (err) {
      if (err instanceof Error) {
        setMessageConfirmation(err.message);
      }
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
        <div>
          <label htmlFor="remember-me">Remember me</label>
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)} />
        </div>
        <button type="submit" disabled={isAuthLoading}>Login</button>
      </form>

      <p>
        Don't have an account?
        <button type="button" onClick={() => navigate("/auth/register")}>
          Register
        </button>
      </p>
      {messageConfirmation}
    </div>
  );
}
