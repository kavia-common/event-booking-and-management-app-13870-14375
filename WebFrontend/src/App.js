import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizerVenues from "./pages/OrganizerVenues";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminVenues from "./pages/AdminVenues";
import AdminEvents from "./pages/AdminEvents";
import NotificationsCenter from "./pages/NotificationsCenter";
import NotFound from "./pages/NotFound";

function App() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <Navbar />
          <main style={{ maxWidth: 1200, margin: "0 auto", padding: "16px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:eventId" element={<EventDetail />} />
              <Route
                path="/book/:eventId"
                element={
                  <ProtectedRoute requiredRoles={["attendee"]}>
                    <Booking />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute requiredRoles={["attendee", "organizer", "admin"]}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my/bookings"
                element={
                  <ProtectedRoute requiredRoles={["attendee"]}>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/dashboard"
                element={
                  <ProtectedRoute requiredRoles={["organizer"]}>
                    <OrganizerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/venues"
                element={
                  <ProtectedRoute requiredRoles={["organizer"]}>
                    <OrganizerVenues />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRoles={["admin"]}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/venues"
                element={
                  <ProtectedRoute requiredRoles={["admin"]}>
                    <AdminVenues />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute requiredRoles={["admin"]}>
                    <AdminEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute requiredRoles={["attendee", "organizer", "admin"]}>
                    <NotificationsCenter />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
