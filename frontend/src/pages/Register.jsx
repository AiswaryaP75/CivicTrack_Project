import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BrandPanel from "../components/BrandPanel";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", ward: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <BrandPanel />
      <div className="auth-formpanel">
        <div className="auth-form-inner">
          <h2>Create your account</h2>
          <p className="auth-subtitle">
            Public sign-up always creates a citizen account. Officer, field
            worker, and admin accounts are created by an administrator.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" type="text" placeholder="Anjali Nair" value={form.name} onChange={onChange} required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" autoComplete="new-password" placeholder="At least 6 characters" value={form.password} onChange={onChange} required minLength={6} />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone (optional)</label>
              <input id="phone" name="phone" type="tel" placeholder="+91 90000 00000" value={form.phone} onChange={onChange} />
            </div>
            <div className="field">
              <label htmlFor="ward">Ward / area (optional)</label>
              <input id="ward" name="ward" type="text" placeholder="Ward 12" value={form.ward} onChange={onChange} />
            </div>

            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? <span className="spinner" /> : null}
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
