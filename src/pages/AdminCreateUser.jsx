import { useState } from "react";
import { api } from "../api";

export default function AdminCreateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [status, setStatus] = useState(null); // { type: "success" | "error", message }
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      await api.createUser({ name, email, password, role });
      setStatus({ type: "success", message: `Account created for ${email}.` });
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="main">
      <h2>Create New User</h2>
      <p className="lead-meta" style={{ marginTop: 6, marginBottom: 20 }}>
        There's no public sign-up — accounts are created here only.
      </p>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 400 }}>
        <div className="field-group">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="field-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field-group">
          <label>Temporary password</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <div className="field-group">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {status && (
          <p style={{ color: status.type === "error" ? "var(--danger)" : "var(--positive)", fontSize: 13 }}>
            {status.message}
          </p>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
