import { createContext, useContext, useState } from "react";

const API = "http://127.0.0.1:8000";
const AuthContext = createContext(null);

// ── Helper: read stored user safely ──
function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  // ──────────────────────────────────────────
  // LOGIN
  // POST /api/auth/login/
  // Body:     { email, password }
  // Returns:  { access, refresh }
  // ──────────────────────────────────────────
  const login = async ({ email, password }) => {
    const res = await fetch(`${API}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      // Django returns { detail: "No active account found..." } on bad credentials
      const err = await res.json();
      const msg = err.detail || "Invalid email or password.";
      throw new Error(msg);
    }

    const { access, refresh } = await res.json();
    localStorage.setItem("access_token",  access);
    localStorage.setItem("refresh_token", refresh);

    // Decode the JWT payload to get basic user info without an extra API call
    const payload = JSON.parse(atob(access.split(".")[1]));
    const userData = {
      id:       payload.user_id,
      email:    payload.email    ?? email,
      username: payload.username ?? "",
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // ──────────────────────────────────────────
  // REGISTER
  // POST /api/auth/register/
  // Body:     { email, username, first_name, last_name, password, password2 }
  // Returns:  UserSerializer fields (id, email, username, first_name,
  //           last_name, avatar, is_onboarded, created_at)
  // ──────────────────────────────────────────
  const register = async (formData) => {
    const res = await fetch(`${API}/api/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      // Django returns field-level errors: { email: ["..."], password: ["..."] }
      const err = await res.json();
      // Re-throw in the shape Register.jsx already handles
      throw { response: { data: err } };
    }

    // Registration succeeded — user still needs to log in to get tokens
    return await res.json();
  };

  // ──────────────────────────────────────────
  // LOGOUT
  // ──────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ──────────────────────────────────────────
  // REFRESH TOKEN
  // Called automatically when a 401 is received
  // ──────────────────────────────────────────
  const refreshAccessToken = async () => {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) throw new Error("No refresh token");

    const res = await fetch(`${API}/api/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      logout(); // refresh expired → force logout
      throw new Error("Session expired. Please log in again.");
    }

    const { access } = await res.json();
    localStorage.setItem("access_token", access);
    return access;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}