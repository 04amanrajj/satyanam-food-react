import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AuthForm from "../components/AuthForm";
import "../styles/profile.css";

const Profile = () => {
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
  };

  const fetchProfileData = useCallback(async (authToken, currentUser) => {
    if (!authToken || !currentUser) return;
    setLoading(true);
    setError("");

    const baseURL = "https://satyanaam-food-backend.onrender.com";

    try {
      // 1. Fetch fresh user details
      let userData = currentUser;
      try {
        const userRes = await axios.get(`${baseURL}/user`, {
          headers: { Authorization: authToken }
        });
        if (userRes.data?.message) {
          userData = userRes.data.message;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
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

      // 3. Populate thali item names
      const populatedOrders = [];
      for (const order of ordersData) {
        const itemsDetail = [];
        for (const item of order.items || []) {
          try {
            const itemRes = await axios.get(`${baseURL}/menu/${item.itemid}`, {
              headers: { Authorization: authToken }
            });
            if (itemRes.data?.data?.[0]) {
              itemsDetail.push({
                ...itemRes.data.data[0],
                quantity: item.quantity
              });
            } else {
              itemsDetail.push({
                name: "Delicious Thali Item",
                price: item.price || 150,
                quantity: item.quantity
              });
            }
          } catch (e) {
            itemsDetail.push({
              name: "Delicious Thali Item",
              price: item.price || 150,
              quantity: item.quantity
            });
          }
        }
        populatedOrders.push({
          ...order,
          itemsDetail
        });
      }

      setOrders(populatedOrders);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch account order records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token && user) {
      fetchProfileData(token, user);
    }
  }, [token, user, fetchProfileData]);

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

  // Active vs completed past orders
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
        {/* Column 1: Active Orders */}
        <div>
          <h4 className="orders-column-title">
            <i className="fas fa-route"></i> Active Tracked Orders ({activeOrders.length})
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
            activeOrders.map((order) => (
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

        {/* Column 2: Past Orders */}
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