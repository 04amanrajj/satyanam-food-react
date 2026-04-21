import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/admin.css";

const AdminDashboard = ({ token, user, handleLogout }) => {
  const [activeTab, setActiveTab] = useState("orders"); // orders, items
  const [orderSubTab, setOrderSubTab] = useState("Pending"); // Pending, Preparing, Prepared, Delivered
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState("");

  // Items State
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [errorItems, setErrorItems] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Track collapse states of order details cards
  const [expandedOrders, setExpandedOrders] = useState({});

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const fetchOrders = useCallback(async (statusFilter) => {
    setLoadingOrders(true);
    setErrorOrders("");
    const baseURL = "https://satyanaam-food-backend.onrender.com";

    try {
      const url = statusFilter
        ? `${baseURL}/admin/order?status=${statusFilter}`
        : `${baseURL}/admin/order`;

      const res = await axios.get(url, {
        headers: { Authorization: token },
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      setErrorOrders("Failed to load active orders stream.");
    } finally {
      setLoadingOrders(false);
    }
  }, [token]);

  const updateOrderStatus = async (orderId, newStatus) => {
    const baseURL = "https://satyanaam-food-backend.onrender.com";
    try {
      setLoadingOrders(true);
      await axios.patch(
        `${baseURL}/admin/order/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: token } }
      );
      fetchOrders(orderSubTab);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update order status");
      setLoadingOrders(false);
    }
  };

  const fetchItems = useCallback(async (query = "") => {
    setLoadingItems(true);
    setErrorItems("");
    const baseURL = "https://satyanaam-food-backend.onrender.com";

    try {
      // The API base URL: /menu?q=query (or just /menu)
      const url = query ? `${baseURL}/menu?q=${query}` : `${baseURL}/menu`;
      const res = await axios.get(url);
      setItems(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setErrorItems("Failed to fetch menu items list.");
    } finally {
      setLoadingItems(false);
    }
  }, []);

  const toggleItemAvailability = async (itemId, currentStatus) => {
    const baseURL = "https://satyanaam-food-backend.onrender.com";
    try {
      await axios.patch(
        `${baseURL}/admin/menu/${itemId}`,
        { available: !currentStatus },
        { headers: { Authorization: token } }
      );
      fetchItems(searchQuery);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to toggle item availability");
    }
  };

  const removeItem = async (itemId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this menu item?");
    if (!confirmDelete) return;

    const baseURL = "https://satyanaam-food-backend.onrender.com";
    try {
      setLoadingItems(true);
      await axios.delete(`${baseURL}/admin/menu/${itemId}`, {
        headers: { Authorization: token },
      });
      fetchItems(searchQuery);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete item");
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders(orderSubTab);
    } else {
      fetchItems(searchQuery);
    }
  }, [activeTab, orderSubTab, searchQuery, fetchOrders, fetchItems]);

  // Derived statistics metrics
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const totalCompletedRevenue = orders
    .filter((o) => o.status === "Delivered")
    .reduce((sum, o) => sum + Number(o.totalprice || 0), 0);

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
                <h4>Completed Revenue</h4>
                <p>Rs.{totalCompletedRevenue.toFixed(2)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box pending">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-content">
                <h4>Pending Orders</h4>
                <p>{pendingCount}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box items">
                <i className="fas fa-hamburger"></i>
              </div>
              <div className="stat-content">
                <h4>Catalog Items</h4>
                <p>{items.length}</p>
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

              {/* Sub-tabs Filters */}
              <div className="admin-sub-tabs">
                {["Pending", "Preparing", "Prepared", "Delivered"].map((stage) => (
                  <button
                    key={stage}
                    className={`sub-tab-btn ${orderSubTab === stage ? "active" : ""}`}
                    onClick={() => setOrderSubTab(stage)}
                  >
                    {stage}
                    {stage === "Pending" && pendingCount > 0 && (
                      <span className="pending-counter-badge">{pendingCount}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Orders Stream container */}
              {loadingOrders ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "var(--color-primary)" }}></i>
                  <p style={{ marginTop: "12px", fontWeight: "600", color: "var(--secondary-text-color)" }}>
                    Loading active order logs...
                  </p>
                </div>
              ) : errorOrders ? (
                <div style={{ color: "#e74c3c", padding: "20px", textAlign: "center" }}>{errorOrders}</div>
              ) : orders.length === 0 ? (
                <div className="admin-order-card" style={{ textAlign: "center", padding: "40px" }}>
                  <i className="fas fa-inbox" style={{ fontSize: "2.5rem", color: "var(--border-color)", marginBottom: "12px" }}></i>
                  <p style={{ fontWeight: "700", color: "var(--secondary-text-color)" }}>No orders found at this stage!</p>
                </div>
              ) : (
                <div className="admin-orders-list">
                  {orders.map((order) => {
                    const statusClass =
                      order.status === "Pending"
                        ? "warning"
                        : order.status === "Preparing"
                        ? "primary"
                        : order.status === "Rejected"
                        ? "danger"
                        : order.status === "Cancelled"
                        ? "secondary"
                        : "success";

                    return (
                      <article key={order._id} className="admin-order-card">
                        <div className="admin-order-header">
                          <div>
                            <div className="admin-order-user">
                              <span className={`order-badge ${order.status?.toLowerCase() || "pending"}`} style={{ marginRight: "10px" }}>
                                {order.status}
                              </span>
                              Order for {order.userName || "Guest Customer"}
                            </div>
                            <span className="admin-order-id">ORDER ID: {order._id}</span>
                          </div>
                          <button className="details-btn" onClick={() => toggleOrderExpand(order._id)}>
                            <i className={`fas ${expandedOrders[order._id] ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                            {expandedOrders[order._id] ? "Less Details" : "More Details"}
                          </button>
                        </div>

                        {/* Collapsible details pane */}
                        {expandedOrders[order._id] && (
                          <div className="details-collapse-card">
                            <p><strong>Shipping Address:</strong> {order.userAddress || "No address provided"}</p>
                            {order.userMSG && <p><strong>Custom Note:</strong> "{order.userMSG}"</p>}
                            {order.userPhone && (
                              <a href={`tel:+91${order.userPhone}`} className="call-user-link">
                                <i className="fas fa-phone-alt"></i> Call Customer (+91 {order.userPhone})
                              </a>
                            )}
                          </div>
                        )}

                        {/* Ordered Items Table */}
                        <table className="order-table" style={{ marginTop: "16px" }}>
                          <thead>
                            <tr>
                              <th>Dish Name</th>
                              <th style={{ textAlign: "center" }}>Qty</th>
                              <th style={{ textAlign: "right" }}>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items?.map((ele, idx) => (
                              <tr key={idx}>
                                <td>{ele.item?.name || "Delicious Thali"}</td>
                                <td style={{ textAlign: "center" }}>{ele.quantity}</td>
                                <td style={{ textAlign: "right" }}>Rs.{(Number(ele.item?.price || 150) * 0.8).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Actions group */}
                        <div className="admin-order-actions">
                          <p style={{ margin: 0, fontWeight: "700" }}>
                            Total Price: <span style={{ color: "var(--color-primary)", fontSize: "1.1rem" }}>Rs.{(order.totalprice || 0).toFixed(2)}</span>
                          </p>

                          <div className="action-btns-group">
                            {order.status === "Pending" && (
                              <>
                                <button className="action-btn accept" onClick={() => updateOrderStatus(order._id, "Preparing")}>
                                  <i className="fas fa-check"></i> Accept
                                </button>
                                <button className="action-btn reject" onClick={() => updateOrderStatus(order._id, "Rejected")}>
                                  <i className="fas fa-times"></i> Reject
                                </button>
                              </>
                            )}
                            {order.status === "Preparing" && (
                              <>
                                <button className="action-btn accept" onClick={() => updateOrderStatus(order._id, "Prepared")}>
                                  <i className="fas fa-utensils"></i> Prepared
                                </button>
                                <button className="action-btn reject" onClick={() => updateOrderStatus(order._id, "Cancelled")}>
                                  <i className="fas fa-times"></i> Cancel
                                </button>
                              </>
                            )}
                            {order.status === "Prepared" && (
                              <>
                                <button className="action-btn accept" onClick={() => updateOrderStatus(order._id, "Delivered")}>
                                  <i className="fas fa-shipping-fast"></i> Delivered
                                </button>
                                <button className="action-btn reject" onClick={() => updateOrderStatus(order._id, "Cancelled")}>
                                  <i className="fas fa-times"></i> Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          ) : (
            <section className="admin-panel-card">
              <div className="panel-header">
                <h2>
                  <i className="fas fa-hamburger"></i> Manage Menu Catalog
                </h2>
              </div>

              {/* Search Bar */}
              <div className="admin-search-bar-wrapper">
                <input
                  type="text"
                  placeholder="🔍 Search dishes by name or ingredients..."
                  className="admin-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Items List */}
              {loadingItems ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: "2rem", color: "var(--color-primary)" }}></i>
                  <p style={{ marginTop: "12px", color: "var(--secondary-text-color)", fontWeight: "600" }}>Syncing item databases...</p>
                </div>
              ) : errorItems ? (
                <div style={{ color: "#e74c3c", padding: "20px", textAlign: "center" }}>{errorItems}</div>
              ) : items.length === 0 ? (
                <div className="admin-item-card" style={{ textAlign: "center", padding: "40px" }}>
                  <i className="fas fa-inbox" style={{ fontSize: "2.5rem", color: "var(--border-color)", marginBottom: "12px" }}></i>
                  <p style={{ fontWeight: "700", color: "var(--secondary-text-color)" }}>No catalog items match your search!</p>
                </div>
              ) : (
                <div className="admin-items-grid">
                  {items.map((item) => (
                    <article key={item._id} className="admin-item-card">
                      <div className="item-left-block">
                        <img
                          src={item.image || "https://i.pinimg.com/736x/82/a3/3a/82a33a43be59e913b58efbdfd64e281e.jpg"}
                          alt={item.name}
                          className="admin-item-img"
                        />
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <div className="item-prices">
                            <span className="og-price">Rs.{item.price.toFixed(2)}</span>
                            <span className="discounted-price">Rs.{(item.price * 0.8).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="item-right-block">
                        {/* Toggle Availability Switch */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span className="availability-text">{item.available ? "Available" : "Sold Out"}</span>
                          <button
                            className={`toggle-switch-btn ${item.available ? "on" : ""}`}
                            onClick={() => toggleItemAvailability(item._id, item.available)}
                          >
                            <i className={`fas fa-toggle-${item.available ? "on" : "off"}`}></i>
                          </button>
                        </div>

                        {/* Control Buttons */}
                        <div className="item-control-btns">
                          <button className="item-control-btn edit" title="Edit Item">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="item-control-btn delete" title="Delete Item" onClick={() => removeItem(item._id)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
