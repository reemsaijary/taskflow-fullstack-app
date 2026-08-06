import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Mail,
  Save,
  UserRound,
} from "lucide-react";

import api from "../api/axios";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import { applyThemePreference } from "../utils/theme";

import "../styles/dashboard.css";
import "../styles/settings.css";

function SettingsPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    date_joined: "",
    bio: "",
    theme_preference: "LIGHT",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setMessage("");
      setMessageType("");

      try {
        const response = await api.get("/auth/me/");
        const user = response.data;

        const themePreference =
          user.profile?.theme_preference || "LIGHT";

        setFormData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          date_joined: user.date_joined || "",
          bio: user.profile?.bio || "",
          theme_preference: themePreference,
        });

        localStorage.setItem(
          "currentUser",
          JSON.stringify(user)
        );

        applyThemePreference(themePreference);
      } catch (requestError) {
        if (requestError.response?.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("currentUser");

          navigate("/login", { replace: true });
          return;
        }

        setMessage("Could not load your account settings.");
        setMessageType("error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleSystemThemeChange = () => {
      if (formData.theme_preference === "SYSTEM") {
        applyThemePreference("SYSTEM");
      }
    };

    mediaQuery.addEventListener(
      "change",
      handleSystemThemeChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemThemeChange
      );
    };
  }, [formData.theme_preference]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (name === "theme_preference") {
      applyThemePreference(value);
    }

    setMessage("");
    setMessageType("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSaving(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await api.patch("/auth/me/", {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        profile: {
          bio: formData.bio,
          theme_preference:
            formData.theme_preference,
        },
      });

      const updatedUser = response.data;

      setFormData((current) => ({
        ...current,
        first_name: updatedUser.first_name || "",
        last_name: updatedUser.last_name || "",
        email: updatedUser.email || current.email,
        date_joined:
          updatedUser.date_joined ||
          current.date_joined,
        bio: updatedUser.profile?.bio || "",
        theme_preference:
          updatedUser.profile?.theme_preference ||
          "LIGHT",
      }));

      localStorage.setItem(
        "currentUser",
        JSON.stringify(updatedUser)
      );

      applyThemePreference(
        updatedUser.profile?.theme_preference ||
          "LIGHT"
      );

      window.dispatchEvent(
        new CustomEvent("current-user-updated", {
          detail: updatedUser,
        })
      );

      setMessage("Settings updated successfully.");
      setMessageType("success");
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("currentUser");

        navigate("/login", { replace: true });
        return;
      }

      const responseData = requestError.response?.data;

      if (responseData && typeof responseData === "object") {
        const firstError =
          Object.values(responseData).flat()[0];

        setMessage(
          typeof firstError === "string"
            ? firstError
            : "Could not update your settings."
        );
      } else {
        setMessage("Could not update your settings.");
      }

      setMessageType("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((current) => !current);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");

    navigate("/login", { replace: true });
  };

  const fullName =
    `${formData.first_name} ${formData.last_name}`.trim() ||
    "TaskFlow User";

  const initials = `${formData.first_name?.[0] || ""}${
    formData.last_name?.[0] || ""
  }`.toUpperCase();

  const joinedDate = formData.date_joined
    ? new Date(formData.date_joined).toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )
    : "Unavailable";

  return (
    <div className="dashboard-page">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onLogout={handleLogout}
      />

      <div className="dashboard-content">
        <Navbar
          isCollapsed={isSidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
        />

        <main className="settings-main">
          <section className="settings-header">
            <div>
              <span className="settings-eyebrow">
                Account preferences
              </span>

              <h1>Settings</h1>

              <p>
                Manage your profile information and
                workspace preferences.
              </p>
            </div>
          </section>

          {isLoading ? (
            <p className="settings-message">
              Loading settings...
            </p>
          ) : (
            <div className="settings-layout">
              <aside className="settings-profile-card">
                <div className="settings-avatar">
                  {initials || (
                    <UserRound size={34} />
                  )}
                </div>

                <h2>{fullName}</h2>
                <p>{formData.email}</p>

                <div className="settings-account-detail">
                  <Mail size={18} />

                  <div>
                    <span>Email</span>
                    <strong>{formData.email}</strong>
                  </div>
                </div>

                <div className="settings-account-detail">
                  <CalendarDays size={18} />

                  <div>
                    <span>Member since</span>
                    <strong>{joinedDate}</strong>
                  </div>
                </div>
              </aside>

              <section className="settings-form-card">
                <div className="settings-section-heading">
                  <span className="settings-section-eyebrow">
                    Profile
                  </span>

                  <h2>Personal information</h2>

                  <p>
                    Update how your account appears in
                    TaskFlow.
                  </p>
                </div>

                <form
                  className="settings-form"
                  onSubmit={handleSubmit}
                >
                  <div className="settings-form-group">
                    <label htmlFor="settings-first-name">
                      First name
                    </label>

                    <input
                      id="settings-first-name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="settings-form-group">
                    <label htmlFor="settings-last-name">
                      Last name
                    </label>

                    <input
                      id="settings-last-name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="settings-form-group full-width">
                    <label htmlFor="settings-email">
                      Email address
                    </label>

                    <input
                      id="settings-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                    />

                    <small>
                      Email cannot be changed from this page.
                    </small>
                  </div>

                  <div className="settings-form-group full-width">
                    <label htmlFor="settings-bio">
                      Bio
                    </label>

                    <textarea
                      id="settings-bio"
                      name="bio"
                      rows="5"
                      placeholder="Tell us a little about yourself..."
                      value={formData.bio}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="settings-form-group full-width">
                    <label htmlFor="settings-theme">
                      Theme preference
                    </label>

                    <select
                      id="settings-theme"
                      name="theme_preference"
                      value={
                        formData.theme_preference
                      }
                      onChange={handleChange}
                    >
                      <option value="LIGHT">
                        Light
                      </option>

                      <option value="DARK">
                        Dark
                      </option>

                      <option value="SYSTEM">
                        System
                      </option>
                    </select>

                    <small>
                      The selected theme is applied
                      immediately and saved to your account.
                    </small>
                  </div>

                  {message && (
                    <div
                      className={`settings-message ${messageType}`}
                    >
                      {messageType === "success" && (
                        <CheckCircle2 size={18} />
                      )}

                      <span>{message}</span>
                    </div>
                  )}

                  <div className="settings-actions full-width">
                    <button
                      className="settings-save-button"
                      type="submit"
                      disabled={isSaving}
                    >
                      <Save size={18} />

                      {isSaving
                        ? "Saving..."
                        : "Save changes"}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default SettingsPage;