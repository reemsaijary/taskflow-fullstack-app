import {
  Bell,
  Menu,
  PanelLeftClose,
  Search,
} from "lucide-react";

function Navbar({
  isCollapsed,
  onToggleSidebar,
  currentUser,
}) {
  const firstName =
    currentUser?.first_name || "User";

  const lastName =
    currentUser?.last_name || "";

  const initials = `${firstName.charAt(0)}${lastName.charAt(
    0
  )}`.toUpperCase();

  return (
    <header className="dashboard-navbar">
      <div className="navbar-left">
        <button
          className="sidebar-toggle"
          type="button"
          onClick={onToggleSidebar}
          aria-label={
            isCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          {isCollapsed ? (
            <Menu size={22} />
          ) : (
            <PanelLeftClose size={22} />
          )}
        </button>

        <div>
          <h2>Dashboard</h2>
          <p>Manage your productivity workspace.</p>
        </div>
      </div>

      <div className="navbar-actions">
        <label className="dashboard-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search tasks..."
          />
        </label>

        <button
          className="navbar-icon-button"
          type="button"
        >
          <Bell size={20} />
          <span className="notification-dot" />
        </button>

        <div className="profile-chip">
          <div className="profile-avatar">
            {initials}
          </div>

          <div className="profile-details">
            <strong>{firstName}</strong>
            <span>My workspace</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;