import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Topbar from "../components/Topbar";
import RoleBadge from "../components/RoleBadge";
import { authApi } from "../api/client";

export default function AdminStaff() {
  const { token } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "officer", ward: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState([]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const data = await authApi.registerStaff(form, token);
      setSuccess(data.message);
      setCreated((prev) => [data.user, ...prev]);
      setForm({ name: "", email: "", password: "", role: "officer", ward: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <Topbar />
      <div className="main-content">
        <div className="page-head">
          <Link to="/dashboard" style={{ fontSize: "0.85rem", color: "var(--deep)", fontWeight: 600, textDecoration: "none" }}>
            ← Back to dashboard
          </Link>
          <h1 style={{ marginTop: "0.6rem" }}>Staff accounts</h1>
          <p>
            Create officer, field worker, or admin accounts. This is the
            only way these roles come into existence — public sign-up
            always creates a citizen.
          </p>
        </div>

        <div className="grid-2">
          <div className="card">
            <h3>Create a staff account</h3>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={onSubmit} noValidate>
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" type="text" value={form.name} onChange={onChange} required />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
              </div>
              <div className="field">
                <label htmlFor="password">Temporary password</label>
                <input id="password" name="password" type="password" value={form.password} onChange={onChange} required minLength={6} />
                <div className="field-hint">At least 6 characters. Share this with the staff member securely.</div>
              </div>
              <div className="field">
                <label htmlFor="role">Role</label>
                <select id="role" name="role" value={form.role} onChange={onChange}>
                  <option value="officer">Municipal Officer</option>
                  <option value="worker">Field Worker</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="ward">Ward / area (optional)</label>
                <input id="ward" name="ward" type="text" placeholder="Ward 12" value={form.ward} onChange={onChange} />
              </div>

              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? <span className="spinner" /> : null}
                {submitting ? "Creating…" : "Create account"}
              </button>
            </form>
          </div>

          <div className="card">
            <h3>Created this session</h3>
            {created.length === 0 ? (
              <div className="empty-note">Accounts you create will appear here.</div>
            ) : (
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {created.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td><RoleBadge role={u.role} /></td>
                      <td>{u.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
