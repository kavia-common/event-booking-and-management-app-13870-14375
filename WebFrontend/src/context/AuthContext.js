import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Api, setAuthToken } from "../services/api";

// Shape of user: { id, email, roles: string[], profile?: {...} }
const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Access auth state and actions. */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication and role context to the application. */
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load current user if token exists
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setLoading(false);
      return;
    }
    Api.me()
      .then((u) => {
        setUser(u);
        const storedRole = localStorage.getItem("active_role");
        if (storedRole && (u.roles || []).includes(storedRole)) {
          setActiveRole(storedRole);
        } else {
          setActiveRole((u.roles && u.roles[0]) || "attendee");
        }
      })
      .catch(() => {
        setAuthToken(null);
        setUser(null);
        setActiveRole("guest");
      })
      .finally(() => setLoading(false));
  }, []);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    /** Log in using UserService token endpoint. */
    const tokenResp = await Api.login(email, password);
    // tokenResp: { access_token, token_type }
    setAuthToken(tokenResp.access_token);
    const u = await Api.me();
    setUser(u);
    setActiveRole((u.roles && u.roles[0]) || "attendee");
    return u;
  };

  // PUBLIC_INTERFACE
  const register = async (payload) => {
    /** Register a new user and directly log them in. */
    await Api.register(payload);
    return login(payload.email, payload.password);
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    /** Clear local auth state. */
    setAuthToken(null);
    setUser(null);
    setActiveRole("guest");
  };

  // PUBLIC_INTERFACE
  const switchRole = (role) => {
    /** Switch active role for RBAC UI. */
    if (role === "guest") {
      setActiveRole("guest");
      localStorage.setItem("active_role", "guest");
      return;
    }
    if (user?.roles?.includes(role)) {
      setActiveRole(role);
      localStorage.setItem("active_role", role);
    }
  };

  const value = useMemo(
    () => ({
      user,
      activeRole,
      isAuthenticated: !!user,
      roles: user?.roles || [],
      loading,
      login,
      register,
      logout,
      switchRole,
    }),
    [user, activeRole, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
