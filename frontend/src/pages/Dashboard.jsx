import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Topbar from "../components/Topbar";
import RoleBadge from "../components/RoleBadge";
import { CheckCircleIcon, XCircleIcon } from "../components/Icons";
import { decodeJwt } from "../api/jwt";

// Mirrors the role checks actually enforced server-side in
// auth_backend/routes/exampleProtectedRoutes.js — this list is for
// demonstration, the real enforcement happens on the backend.
const PERMISSIONS = [
  { action: "View own complaints", roles: ["citizen", "officer", "worker", "admin"] },
  { action: "Verify a submitted complaint", roles: ["officer", "admin"] },
  { action: "Mark a complaint resolved", roles: ["worker"] },
  { action: "Access system settings", roles: ["admin"] },
  { action: "Create officer / worker / admin accounts", roles: ["admin"] },
];

export default function Dashboard() {
  const { user, token } = useAuth();

  const decoded = useMemo(() => (token ? decodeJwt(token) : null), [token]);

  const expiryText = useMemo(() => {
    if (!decoded?.exp) return "—";
    const date = new Date(decoded.exp * 1000);
    return date.toLocaleString();
  }, [decoded]);

  return (
    <div className="app-shell">
      <Topbar />
      <div className="main-content">
        <div className="page-head">
          <h1>Welcome, {user?.name?.split(" ")[0]}</h1>
          <p>Here's your account, and what your role can do on CivicTrack.</p>
        </div>

        <div className="grid-2">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="card">
              <h3>Your profile</h3>
              <div className="profile-row">
                <span className="k">Name</span>
                <span className="v">{user?.name}</span>
              </div>
              <div className="profile-row">
                <span className="k">Email</span>
                <span className="v">{user?.email}</span>
              </div>
              <div className="profile-row">
                <span className="k">Role</span>
                <span className="v"><RoleBadge role={user?.role} /></span>
              </div>
              <div className="profile-row">
                <span className="k">Ward</span>
                <span className="v">{user?.ward || "—"}</span>
              </div>
              <div className="profile-row">
                <span className="k">Account created</span>
                <span className="v">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                </span>
              </div>
            </div>

            <div className="card">
              <h3>What your role can do</h3>
              <div className="perm-list">
                {PERMISSIONS.map((p) => {
                  const allowed = p.roles.includes(user?.role);
                  return (
                    <div key={p.action} className={`perm-item ${allowed ? "" : "denied"}`}>
                      {allowed ? (
                        <CheckCircleIcon className="perm-icon allow" />
                      ) : (
                        <XCircleIcon className="perm-icon deny" />
                      )}
                      <span>{p.action}</span>
                    </div>
                  );
                })}
              </div>
              {user?.role === "admin" && (
                <p style={{ marginTop: "1.1rem" }}>
                  <Link to="/admin/staff" className="btn btn-secondary btn-sm" style={{ display: "inline-flex" }}>
                    Manage staff accounts →
                  </Link>
                </p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="section-label">JWT session (live)</div>
            <h3 style={{ marginTop: "-0.4rem" }}>Your access token</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0.9rem", lineHeight: 1.5 }}>
              This token was issued by the backend on login and is sent with
              every request. The server verifies its signature and re-checks
              the role on every protected route — nothing here is trusted
              client-side.
            </p>
            <div className="token-box">{token}</div>
            <div className="token-meta">
              <span className="chip">alg: HS256</span>
              <span className="chip">role: {decoded?.role}</span>
              <span className="chip">user id: {decoded?.id?.slice(0, 10)}…</span>
              <span className="chip">expires: {expiryText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
