import {
  Bell,
  Menu,
  PanelLeftClose,
  Search,
} from "lucide-react";

function getStoredUser() {
  try {
    const storedUser =
      localStorage.getItem("currentUser");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    return null;
  }
}

function Navbar({
  isCollapsed,
  onToggleSidebar,
  currentUser,
}) {
  /*
   * Some pages already fetch the user and pass it
   * through currentUser.
   *
   * Other pages do not.
   *
   * In that case, Navbar automatically falls back
   * to the user saved in localStorage after login.
   */
  const user =
    currentUser || getStoredUser();

  const firstName =
    user?.first_name?.trim() || "User";

  const lastName =
    user?.last_name?.trim() || "";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(
      0
    )}`.toUpperCase() || "U";

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
          title={
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

          <p>
            Manage your productivity workspace.
          </p>
        </div>
      </div>

      <div className="navbar-actions">
        <label className="dashboard-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search tasks..."
            aria-label="Search tasks"
          />
        </label>

        <button
          className="navbar-icon-button"
          type="button"
          aria-label="Notifications"
          title="Notifications"
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