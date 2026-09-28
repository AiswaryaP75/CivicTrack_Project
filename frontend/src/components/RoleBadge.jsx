const LABELS = {
  citizen: "Citizen",
  officer: "Municipal Officer",
  worker: "Field Worker",
  admin: "Administrator",
};

export default function RoleBadge({ role, className = "" }) {
  return (
    <span className={`role-badge role-${role} ${className}`}>
      {LABELS[role] || role}
    </span>
  );
}
