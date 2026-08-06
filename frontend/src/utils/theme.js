const THEME_STORAGE_KEY = "taskflowTheme";

export const getSavedThemePreference = () => {
  return localStorage.getItem(THEME_STORAGE_KEY) || "LIGHT";
};

const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const applyThemePreference = (preference) => {
  const normalizedPreference = (
    preference || "LIGHT"
  ).toUpperCase();

  const resolvedTheme =
    normalizedPreference === "SYSTEM"
      ? getSystemTheme()
      : normalizedPreference.toLowerCase();

  document.documentElement.setAttribute(
    "data-theme",
    resolvedTheme
  );

  document.documentElement.setAttribute(
    "data-theme-preference",
    normalizedPreference.toLowerCase()
  );

  localStorage.setItem(
    THEME_STORAGE_KEY,
    normalizedPreference
  );

  return resolvedTheme;
};

export const initializeTheme = () => {
  return applyThemePreference(getSavedThemePreference());
};