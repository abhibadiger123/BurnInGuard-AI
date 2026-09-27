import { useState } from "react";
import { register } from "./api";

function Register({ onRegistered, onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await register(
        name,
        email,
        password
      );

      setSuccess(
        "Account created successfully."
      );

      setTimeout(() => {
        onRegistered(email);
      }, 1000);

    } catch (error) {
      setError(
        error.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">

      <div className="login-background-grid"></div>

      <div className="login-glow"></div>

      <div className="login-card register-card">

        <div className="login-brand">

          <div className="login-logo">
            B
          </div>

          <div>
            <h1>
              BurnInGuard AI
            </h1>

            <p>
              Component Intelligence Platform
            </p>
          </div>

        </div>

        <div className="login-status">

          <span></span>

          AI ENGINE READY

        </div>

        <div className="login-heading">

          <h2>
            Create Account
          </h2>

          <p>
            Register an engineer account to
            access BurnInGuard AI.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter your full name"
              required
            />

          </div>

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="engineer@example.com"
              required
            />

          </div>

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Minimum 6 characters"
              required
            />

          </div>

          <div className="form-group">

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              placeholder="Re-enter your password"
              required
            />

          </div>

          {error && (
            <div className="login-error">

              <span>!</span>

              {error}

            </div>
          )}

          {success && (
            <div className="register-success">

              <span>✓</span>

              {success}

            </div>
          )}

          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="spinner"></span>

                Creating Account...
              </>
            ) : (
              <>
                Create Account

                <span>→</span>
              </>
            )}

          </button>

        </form>

        <div className="register-login-link">

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={onBackToLogin}
          >
            Sign In
          </button>

        </div>

        <div className="login-security">

          <span>🔒</span>

          Secure JWT authentication

        </div>

        <div className="login-footer">

          <span>
            Synthetic Burn-In Data
          </span>

          <span>•</span>

          <span>
            Hackathon Prototype
          </span>

        </div>

      </div>

    </div>
  );
}

export default Register;