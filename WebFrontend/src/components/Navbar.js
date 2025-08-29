import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

// Simple responsive navbar with role switch and auth actions.
// PUBLIC_INTERFACE
export default function Navbar() {
  const { isAuthenticated, user, activeRole, switchRole, logout } = useAuth();

  const availableRoles = ["guest", ...(user?.roles || [])];

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">Evently</Link>
        <NavLink to="/events" className="nav-link">Events</NavLink>
        {isAuthenticated && activeRole === "attendee" && (
          <NavLink to="/my/bookings" className="nav-link">My Bookings</NavLink>
        )}
        {isAuthenticated && activeRole === "organizer" && (
          <>
            <NavLink to="/organizer/dashboard" className="nav-link">Organizer</NavLink>
            <NavLink to="/organizer/venues" className="nav-link">Venues</NavLink>
          </>
        )}
        {isAuthenticated && activeRole === "admin" && (
          <>
            <NavLink to="/admin/dashboard" className="nav-link">Admin</NavLink>
            <NavLink to="/admin/users" className="nav-link">Users</NavLink>
            <NavLink to="/admin/venues" className="nav-link">Venues</NavLink>
            <NavLink to="/admin/events" className="nav-link">Events</NavLink>
            <NavLink to="/admin/notifications" className="nav-link">Notifications</NavLink>
          </>
        )}
      </div>
      <div className="nav-right">
        <label className="sr-only" htmlFor="role-select">Switch role</label>
        <select
          id="role-select"
          className="role-select"
          value={activeRole}
          onChange={(e) => switchRole(e.target.value)}
          aria-label="Active role"
        >
          {availableRoles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {!isAuthenticated ? (
          <>
            <NavLink to="/login" className="btn small">Login</NavLink>
            <NavLink to="/register" className="btn small outline">Register</NavLink>
          </>
        ) : (
          <button className="btn small danger" onClick={logout} aria-label="Logout">Logout</button>
        )}
        <NavLink to="/notifications" className="icon-link" aria-label="Notifications">🔔</NavLink>
      </div>
    </nav>
  );
}
