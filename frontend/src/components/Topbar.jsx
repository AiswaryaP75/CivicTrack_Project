import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RoleBadge from "./RoleBadge";
import { PinIcon, LogoutIcon } from "./Icons";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="topbar">
      <div className="brand-mark">
        <PinIcon className="pin" />
        CivicTrack
      </div>
      <div className="topbar-user">
        <span className="name">{user?.name}</span>
        <RoleBadge role={user?.role} />
        <button className="btn btn-secondary btn-sm" onClick={onLogout} style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
          <LogoutIcon width={15} height={15} />
          Log out
        </button>
      </div>
    </div>
  );
}
