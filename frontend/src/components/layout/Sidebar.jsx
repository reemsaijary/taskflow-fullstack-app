import {
  BarChart3,
  Folder,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar({ isCollapsed, onLogout }) {
  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Tasks",
      path: "/tasks",
      icon: ListTodo,
    },
    {
      label: "Categories",
      path: "/categories",
      icon: Folder,
    },
    {
      label: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`sidebar ${isCollapsed ? "sidebar-collapsed" : ""}`}
    >
      <div className="sidebar-logo">
        <span className="sidebar-logo-mark">✓</span>

        {!isCollapsed && (
          <span className="sidebar-logo-text">TaskFlow</span>
        )}
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="nav-icon" size={20} />

              {!isCollapsed && (
                <span className="nav-label">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <button
        className="logout-button"
        type="button"
        onClick={onLogout}
        title={isCollapsed ? "Logout" : undefined}
      >
        <LogOut size={20} />

        {!isCollapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}

export default Sidebar;