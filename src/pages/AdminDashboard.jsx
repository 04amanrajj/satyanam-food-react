import React, { useState } from "react";
import "../styles/admin.css";

const AdminDashboard = ({ token, user, handleLogout }) => {
  const [activeTab, setActiveTab] = useState("orders"); // orders, items

  return (
    <div className="admin-dashboard-container">
      <div className="admin-layout-grid">
        {/* Left Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-user-profile">
            <img
              src="https://bootdey.com/img/Content/avatar/avatar1.png"
              alt={user?.name || "Admin"}
              className="admin-avatar"
            />
            <h3 className="admin-name">{user?.name || "Admin Manager"}</h3>
            <span className="admin-role-badge">{user?.role || "Admin"}</span>
          </div>

          <nav className="admin-nav-list">
            <button
              className={`admin-nav-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <i className="fas fa-shopping-bag"></i> Manage Orders
            </button>
            <button
              className={`admin-nav-btn ${activeTab === "items" ? "active" : ""}`}
              onClick={() => setActiveTab("items")}
            >
              <i className="fas fa-utensils"></i> Manage Menu Items
            </button>
            <button className="admin-nav-btn danger-zone" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout Session
            </button>
          </nav>
        </aside>

        {/* Right Content Panel */}
        <main>
          {/* Quick Stats Grid */}
          <section className="admin-stats-grid">
            <div className="stat-card">
              <div className="stat-icon-box revenue">
                <i className="fas fa-rupee-sign"></i>
              </div>
              <div className="stat-content">
                <h4>Total Revenue</h4>
                <p>Rs.0.00</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box pending">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-content">
                <h4>Pending Orders</h4>
                <p>0</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box items">
                <i className="fas fa-hamburger"></i>
              </div>
              <div className="stat-content">
                <h4>Catalog Items</h4>
                <p>0</p>
              </div>
            </div>
          </section>

          {/* Tab Panels */}
          {activeTab === "orders" ? (
            <section className="admin-panel-card">
              <div className="panel-header">
                <h2>
                  <i className="fas fa-clipboard-list"></i> Manage Orders Pipeline
                </h2>
              </div>
              <div style={{ textAlign: "center", padding: "40px", color: "var(--secondary-text-color)" }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "var(--color-primary)" }}></i>
                <p style={{ marginTop: "12px", fontWeight: "600" }}>Initializing orders management stream...</p>
              </div>
            </section>
          ) : (
            <section className="admin-panel-card">
              <div className="panel-header">
                <h2>
                  <i className="fas fa-hamburger"></i> Manage Menu Catalog
                </h2>
              </div>
              <div style={{ textAlign: "center", padding: "40px", color: "var(--secondary-text-color)" }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "var(--color-primary)" }}></i>
                <p style={{ marginTop: "12px", fontWeight: "600" }}>Syncing item databases...</p>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
