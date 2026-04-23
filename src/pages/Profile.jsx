import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRestaurant } from "../contexts/RestaurantContext";
import AuthForm from "../components/AuthForm";
import AdminDashboard from "./AdminDashboard";
import "../styles/profile.css";

const Profile = () => {
  const { menu } = useRestaurant();
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("user") || localStorage.getItem("person");
    return cached ? JSON.parse(cached) : null;
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("person");
    setToken("");
    setUser(null);
    setOrders([]);
    // Ensure clean state redirect to main page
    window.location.href = "/";
  };

  const fetchProfileData = useCallback(async (authToken, currentUser) => {
    if (!authToken || !currentUser) return;
    setLoading(true);
    setError("");

    const baseURL = "https://satyanaam-food-backend.onrender.com";

    try {
      // 1. Fetch live user details
      let userData = currentUser;
      try {
        const userRes = await axios.get(`${baseURL}/user`, {
          headers: { Authorization: authToken }
        });
        if (userRes.data?.message) {
          userData = userRes.data.message;
          // Only update state if values have actually changed (breaks the infinite API loop!)
          if (JSON.stringify(currentUser) !== JSON.stringify(userData)) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }
        }
      } catch (err) {
        console.error("Failed to fetch fresh user details:", err);
      }

      // 2. Fetch order history
      const orderPayload = {
        userName: userData?.name || userData?.userName,
        userPhone: userData?.phone || userData?.userPhone
      };

      const ordersRes = await axios.post(`${baseURL}/order`, orderPayload, {
        headers: { Authorization: authToken }
      });

      const ordersData = ordersRes.data || [];

      // 3. For each order, look up details in the cached menu array to avoid Rate Limits (429)
      let fullMenu = menu || [];
      if (fullMenu.length === 0) {
        try {
          const menuRes = await axios.get(`${baseURL}/menu`);
          fullMenu = menuRes.data?.data || [];
        } catch (e) {
          console.error("Failed to load fallback menu list:", e);
        }
      }

      // Map for O(1) in-memory lookups
      const menuMap = new Map(fullMenu.map((m) => [m._id || m.id, m]));

      const populatedOrders = ordersData.map((order) => {
        const itemsDetail = (order.items || []).map((item) => {
          const menuInfo = menuMap.get(item.itemid || item.item?._id || item.item?.id);
          return {
            name: menuInfo?.name || "Delicious Thali Item",
            price: menuInfo?.price || item.price || 150,
            quantity: item.quantity,
          };
        });
        return {
          ...order,
          itemsDetail,
        };
      });

      setOrders(populatedOrders);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load order history details.");
    } finally {
      setLoading(false);
    }
  }, [menu]);

  useEffect(() => {
    if (token && user) {
      fetchProfileData(token, user);
    }
  }, [token, user, fetchProfileData]);

  // If user is admin, render the Admin Dashboard instead
  if (token && user?.role === "admin") {
    return <AdminDashboard token={token} user={user} handleLogout={handleLogout} />;
  }

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

  // Categories of orders
  const activeOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "pending" ||
      order.status?.toLowerCase() === "preparing" ||
      order.status?.toLowerCase() === "prepared"
  );

  const pastOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() !== "pending" &&
      order.status?.toLowerCase() !== "preparing" &&
      order.status?.toLowerCase() !== "prepared"
  );

  // Status index for progress bar
  const getStatusStep = (status) => {
    const st = status?.toLowerCase();
    if (st === "preparing") return 1;
    if (st === "prepared") return 2;
    if (st === "delivered") return 3;
    return 0; // pending
  };

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

      {error && (
        <div style={{ color: "#e74c3c", background: "rgba(231,76,60,0.1)", padding: "12px", borderRadius: "12px", marginBottom: "30px", fontWeight: "600", fontSize: "0.95rem", textAlign: "center", border: "1px solid rgba(231,76,60,0.2)" }}>
          <i className="fas fa-exclamation-circle" style={{ marginRight: "8px" }}></i> {error}
        </div>
      )}

      {/* Main Grid: Active Orders vs Past Orders */}
      <div className="profile-orders-section">
        {/* Column 1: Active Orders & Tracker */}
        <div>
          <h4 className="orders-column-title">
            <i className="fas fa-route"></i> Active Tracked Orders
          </h4>

          {loading && orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--secondary-text-color)" }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "var(--color-primary)" }}></i>
              <p style={{ marginTop: "12px", fontWeight: "600" }}>Loading active order trackers...</p>
            </div>
          ) : activeOrders.length === 0 ? (
            <div className="order-card" style={{ textAlign: "center", padding: "40px", color: "var(--secondary-text-color)" }}>
              <i className="fas fa-utensils" style={{ fontSize: "2.5rem", color: "var(--border-color)", marginBottom: "16px" }}></i>
              <p style={{ fontWeight: "700" }}>No active order trackers right now!</p>
              <p style={{ fontSize: "0.88rem", marginTop: "4px" }}>Order a hot thali from the Menu page to track it here live.</p>
            </div>
          ) : (
            activeOrders.map((order) => {
              const currentStep = getStatusStep(order.status);
              const progressWidth = `${(currentStep / 3) * 100}%`;

              return (
                <article key={order._id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <span className="order-id">ORDER #{order._id}</span>
                      <div style={{ fontSize: "0.85rem", color: "var(--secondary-text-color)", marginTop: "4px" }}>
                        Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Today"}
                      </div>
                    </div>
                    <span className={`order-badge ${order.status?.toLowerCase() || "pending"}`}>
                      {order.status || "Pending"}
                    </span>
                  </div>

                  {/* Step Progress Tracker */}
                  <div className="tracking-container">
                    <div className="tracking-line">
                      <div className="tracking-line-progress" style={{ width: progressWidth }}></div>
                    </div>

                    <div className={`tracking-step ${currentStep >= 0 ? "active" : ""}`}>
                      <div className="tracking-dot">
                        <i className="fas fa-clipboard-check"></i>
                      </div>
                      <span className="tracking-label">Confirmed</span>
                    </div>

                    <div className={`tracking-step ${currentStep >= 1 ? "active" : ""}`}>
                      <div className="tracking-dot">
                        <i className="fas fa-fire"></i>
                      </div>
                      <span className="tracking-label">Cooking</span>
                    </div>

                    <div className={`tracking-step ${currentStep >= 2 ? "active" : ""}`}>
                      <div className="tracking-dot">
                        <i className="fas fa-people-carry"></i>
                      </div>
                      <span className="tracking-label">Prepared</span>
                    </div>

                    <div className={`tracking-step ${currentStep >= 3 ? "active" : ""}`}>
                      <div className="tracking-dot">
                        <i className="fas fa-check-double"></i>
                      </div>
                      <span className="tracking-label">Delivered</span>
                    </div>
                  </div>

                  {/* Item Details Table */}
                  <table className="order-table">
                    <thead>
                      <tr>
                        <th>Item Description</th>
                        <th style={{ textAlign: "center" }}>Qty</th>
                        <th style={{ textAlign: "right" }}>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.itemsDetail?.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.name}</td>
                          <td style={{ textAlign: "center" }}>{item.quantity}</td>
                          <td style={{ textAlign: "right" }}>Rs.{(item.price * 0.8).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="order-card-footer">
                    <span className="order-total-label">Total Amount Paid</span>
                    <span className="order-total-price">Rs.{Number(order.totalprice || 0).toFixed(2)}</span>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Column 2: Order History */}
        <div>
          <h4 className="orders-column-title">
            <i className="fas fa-history"></i> Past Order History
          </h4>

          {loading && orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--secondary-text-color)" }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "var(--color-primary)" }}></i>
              <p style={{ marginTop: "12px", fontWeight: "600" }}>Loading past thalis...</p>
            </div>
          ) : pastOrders.length === 0 ? (
            <div className="order-card" style={{ textAlign: "center", padding: "40px", color: "var(--secondary-text-color)" }}>
              <i className="fas fa-archive" style={{ fontSize: "2.5rem", color: "var(--border-color)", marginBottom: "16px" }}></i>
              <p style={{ fontWeight: "700" }}>No past orders found!</p>
              <p style={{ fontSize: "0.88rem", marginTop: "4px" }}>Your completed past orders will appear here.</p>
            </div>
          ) : (
            pastOrders.map((order) => (
              <article key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <span className="order-id">ORDER #{order._id}</span>
                    <div style={{ fontSize: "0.85rem", color: "var(--secondary-text-color)", marginTop: "4px" }}>
                      Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Past date"}
                    </div>
                  </div>
                  <span className={`order-badge ${order.status?.toLowerCase() || "completed"}`}>
                    {order.status || "Completed"}
                  </span>
                </div>

                <table className="order-table">
                  <thead>
                    <tr>
                      <th>Item Description</th>
                      <th style={{ textAlign: "center" }}>Qty</th>
                      <th style={{ textAlign: "right" }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.itemsDetail?.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td style={{ textAlign: "center" }}>{item.quantity}</td>
                        <td style={{ textAlign: "right" }}>Rs.{(item.price * 0.8).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="order-card-footer">
                  <span className="order-total-label">Total Amount Paid</span>
                  <span className="order-total-price">Rs.{Number(order.totalprice || 0).toFixed(2)}</span>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;