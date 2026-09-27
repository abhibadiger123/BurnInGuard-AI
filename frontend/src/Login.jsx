import { useState } from "react";
import { login } from "./api";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await login(email, password);
      // Assuming the API returns an object with a token
      onLogin(data.access_token || data.token);
    } catch (error) {
      setError(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-background-grid"></div>
      <div className="login-glow"></div>
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">B</div>
          <div>
            <h1>BurnInGuard AI</h1>
            <p>Component Intelligence Platform</p>
          </div>
        </div>

        <div className="login-status">
          <span></span>
          SYSTEM ONLINE
        </div>

        <div className="login-heading">
          <h2>Welcome Back</h2>
          <p>Sign in to your engineer dashboard.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="engineer@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="login-error">
              <span>!</span>
              {error}
            </div>
          )}

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Authenticating...
              </>
            ) : (
              <>
                Sign In
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="register-login-link">
          <span>Need an account?</span>
          <button type="button" onClick={onRegister}>
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;