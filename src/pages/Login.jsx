import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Couldn't log in — check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email above first, then click 'Forgot password?'");
      return;
    }
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      setError("Couldn't send reset email — check the address is correct.");
    }
  }

  return (
    <div className="login-screen">
      <div className="card login-card">
        <h1>Lead Gen</h1>
        <p className="lead-meta" style={{ marginBottom: 20 }}>
          Log in to see your leads.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          {resetSent && (
            <p style={{ color: "var(--positive)", fontSize: 13 }}>
              Reset email sent — check your inbox.
            </p>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 4 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <button
          onClick={handleForgotPassword}
          className="nav-link"
          style={{ marginTop: 12, fontSize: 12.5 }}
        >
          Forgot password?
        </button>
      </div>
    </div>
  );
}
