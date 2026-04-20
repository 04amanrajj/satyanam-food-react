import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import "../styles/profile.css";

const Profile = () => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user") || localStorage.getItem("person");
    return cached ? JSON.parse(cached) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("person");
    setToken("");
    setUser(null);
  };

  // If user is not authenticated, render login/signup
  if (!token) {
    return (
      <div className="bg--primary">
        <AuthForm
          onAuthSuccess={() => {
            const newToken = localStorage.getItem("token") || "";
            const cachedUser = localStorage.getItem("user") || localStorage.getItem("person");
            const parsedUser = cachedUser ? JSON.parse(cachedUser) : null;
            setToken(newToken);
            setUser(parsedUser);
          }}
        />
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Profile Header Card */}
      <section className="profile-card">
        <div className="profile-info-block">
          <img
            src="https://bootdey.com/img/Content/avatar/avatar1.png"
            alt={user?.name || user?.userName || "Member"}
            className="profile-avatar"
          />
          <div className="profile-meta">
            <h3>{user?.name || user?.userName || "Satyanaam Guest"}</h3>
            <p>
              <i className="fas fa-envelope"></i> {user?.email || "No email provided"}
            </p>
            <p>
              <i className="fas fa-phone-alt"></i> {user?.phone || user?.userPhone || "No phone registered"}
            </p>
          </div>
        </div>

        <button className="profile-logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout Session
        </button>
      </section>
    </div>
  );
};

export default Profile;