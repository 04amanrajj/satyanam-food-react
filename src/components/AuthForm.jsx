import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

const CreateAccount = () => {
  const [randomImageNumber] = useState(() => Math.floor(Math.random() * 4) + 1);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [username, setUsername] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [loginForm, setLoginForm] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    day: "",
    month: "",
    year: "",
    password: "",
    agree: false,
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Submission handler placeholder
  };

  useEffect(() => {
    if (username) {
      setCheckingUsername(true);
      const delayDebounceFn = setTimeout(() => {
        setIsUsernameAvailable(username.length >= 6);
        setCheckingUsername(false);
      }, 800);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setIsUsernameAvailable(false);
      setCheckingUsername(false);
    }
  }, [username]);

  const getDaysInMonth = (month, year) => {
    if (month === "February") {
      const yr = parseInt(year, 10) || new Date().getFullYear();
      return yr % 4 === 0 && (yr % 100 !== 0 || yr % 400 === 0) ? 29 : 28;
    }
    return ["April", "June", "September", "November"].includes(month) ? 30 : 31;
  };

  const days = [
    ...Array(getDaysInMonth(selectedMonth, selectedYear)).keys(),
  ].map((day) => day + 1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isFormValid = () => {
    if (loginForm) {
      return formData.email.trim() !== "" && formData.password.trim() !== "";
    }
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      username.trim() !== "" &&
      isUsernameAvailable &&
      formData.gender.trim() !== "" &&
      formData.day.trim() !== "" &&
      formData.month.trim() !== "" &&
      formData.year.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.agree
    );
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.96, transition: { duration: 0.4, ease: "easeIn" } }
  };

  return (
    <div className="auth-page-container">
      <AnimatePresence mode="wait">
        {loginForm ? (
          <motion.div
            key="login-card"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="auth-card-wrapper"
          >
            {/* Form Column */}
            <div className="auth-form-side">
              <header className="auth-header">
                <h2 className="auth-title">Welcome Back!</h2>
                <p className="auth-subtitle">Login to your Satyanam account to order delicious thalis</p>
              </header>

              <form onSubmit={handleFormSubmit}>
                <div className="auth-group">
                  <label className="auth-label">Email Address</label>
                  <div className="auth-input-wrapper">
                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      className="auth-input auth-input-with-icon"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <i className="fas fa-envelope auth-input-icon"></i>
                  </div>
                </div>

                <div className="auth-group">
                  <label className="auth-label">Password</label>
                  <div className="auth-input-wrapper">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      className="auth-input auth-input-with-icon"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <i className="fas fa-lock auth-input-icon"></i>
                    <i
                      className={`fas ${passwordVisible ? "fa-eye-slash" : "fa-eye"} auth-eye-icon`}
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    ></i>
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-btn"
                  disabled={!isFormValid()}
                >
                  Login Account
                </button>
              </form>

              <p className="auth-switch-text">
                Don't have an account?{" "}
                <span
                  onClick={() => {
                    setLoginForm(false);
                    setPasswordVisible(false);
                  }}
                  className="auth-switch-btn"
                >
                  Create Account
                </span>
              </p>
            </div>

            {/* Visual Block Column */}
            <div
              className="auth-visual-side"
              style={{
                backgroundImage: `url('/coverpage/img${randomImageNumber}.jpeg')`,
              }}
            >
              <div className="auth-visual-overlay"></div>
              <div className="auth-visual-content">
                <h3 className="auth-visual-title">Satyanaam Food</h3>
                <p className="auth-visual-desc">Pure Vegetarian. Pure Delight. Fresh traditional meals prepared daily with organic ingredients and love.</p>
                
                <div className="auth-visual-features">
                  <div className="auth-feature-item">
                    <i className="fas fa-leaf"></i>
                    <span>100% Pure Vegetarian Thalis</span>
                  </div>
                  <div className="auth-feature-item">
                    <i className="fas fa-truck"></i>
                    <span>Express Delivery at Your Doorstep</span>
                  </div>
                  <div className="auth-feature-item">
                    <i className="fas fa-fire"></i>
                    <span>Fresh & Hot Traditional Recipes</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="signup-card"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="auth-card-wrapper"
          >
            {/* Visual Block Column (Left on signup for organic layout shift!) */}
            <div
              className="auth-visual-side"
              style={{
                backgroundImage: `url('/coverpage/img${randomImageNumber}.jpeg')`,
              }}
            >
              <div className="auth-visual-overlay"></div>
              <div className="auth-visual-content">
                <h3 className="auth-visual-title">Join Our Kitchen!</h3>
                <p className="auth-visual-desc">Create an account to gain access to member-only rewards, hot meal bundles, and faster checkouts.</p>
                
                <div className="auth-visual-features">
                  <div className="auth-feature-item">
                    <i className="fas fa-percent"></i>
                    <span>Exclusive First-Order Discounts</span>
                  </div>
                  <div className="auth-feature-item">
                    <i className="fas fa-clock"></i>
                    <span>Faster Order Checks & Saves</span>
                  </div>
                  <div className="auth-feature-item">
                    <i className="fas fa-heart"></i>
                    <span>Save Your Favorite Dishes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="auth-form-side">
              <header className="auth-header">
                <h2 className="auth-title">Create Account</h2>
                <p className="auth-subtitle">Join us to start ordering premium vegetarian foods</p>
              </header>

              <form onSubmit={handleFormSubmit}>
                <div className="auth-group">
                  <label className="auth-label">Your Name</label>
                  <div className="auth-row">
                    <div className="auth-row-half">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="auth-input"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="auth-row-half">
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="auth-input"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="auth-row">
                  <div className="auth-row-half auth-group">
                    <label className="auth-label">Email Address</label>
                    <div className="auth-input-wrapper">
                      <input
                        type="email"
                        placeholder="name@email.com"
                        className="auth-input auth-input-with-icon"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <i className="fas fa-envelope auth-input-icon"></i>
                    </div>
                  </div>

                  <div className="auth-row-half auth-group">
                    <label className="auth-label">Username</label>
                    <div className="auth-input-wrapper">
                      <input
                        type="text"
                        placeholder="username"
                        className="auth-input auth-input-with-icon"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                      <i className="fas fa-user auth-input-icon"></i>
                      <span className="username-status">
                        {checkingUsername ? (
                          <i className="fas fa-spinner fa-spin text-primary"></i>
                        ) : username ? (
                          isUsernameAvailable ? (
                            <i className="fas fa-check-circle text-green-500"></i>
                          ) : (
                            <i className="fas fa-times-circle text-red-500" title="Username must be at least 6 characters"></i>
                          )
                        ) : null}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="auth-row">
                  <div className="auth-row-half auth-group">
                    <label className="auth-label">Gender</label>
                    <select
                      className="auth-input auth-select"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="auth-row-half auth-group">
                    <label className="auth-label">Birthday</label>
                    <div className="auth-row" style={{ gap: "8px" }}>
                      <div className="auth-row-third">
                        <select
                          className="auth-input auth-select"
                          name="day"
                          value={formData.day}
                          onChange={handleChange}
                          style={{ padding: "12px 8px" }}
                          required
                        >
                          <option value="">DD</option>
                          {days.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="auth-row-third">
                        <select
                          className="auth-input auth-select"
                          name="month"
                          value={formData.month}
                          onChange={(e) => {
                            setSelectedMonth(e.target.value);
                            handleChange(e);
                          }}
                          style={{ padding: "12px 8px" }}
                          required
                        >
                          <option value="">MM</option>
                          {[
                            "January",
                            "February",
                            "March",
                            "April",
                            "May",
                            "June",
                            "July",
                            "August",
                            "September",
                            "October",
                            "November",
                            "December",
                          ].map((m) => (
                            <option key={m} value={m}>
                              {m.substring(0, 3)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="auth-row-third">
                        <select
                          className="auth-input auth-select"
                          name="year"
                          value={formData.year}
                          onChange={(e) => {
                            setSelectedYear(e.target.value);
                            handleChange(e);
                          }}
                          style={{ padding: "12px 8px" }}
                          required
                        >
                          <option value="">YYYY</option>
                          {Array.from(
                            { length: 80 },
                            (_, i) => new Date().getFullYear() - 10 - i
                          ).map((yr) => (
                            <option key={yr} value={yr}>
                              {yr}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="auth-group">
                  <label className="auth-label">Password</label>
                  <div className="auth-input-wrapper">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="auth-input auth-input-with-icon"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <i className="fas fa-lock auth-input-icon"></i>
                    <i
                      className={`fas ${passwordVisible ? "fa-eye-slash" : "fa-eye"} auth-eye-icon`}
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    ></i>
                  </div>
                </div>

                <div className="auth-checkbox-group">
                  <input
                    type="checkbox"
                    className="auth-checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    id="terms-agree"
                    required
                  />
                  <label htmlFor="terms-agree" className="auth-checkbox-label">
                    I agree to the <Link to="/terms">Terms & Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>
                  </label>
                </div>

                <button
                  type="submit"
                  className="auth-btn"
                  disabled={!isFormValid()}
                >
                  Create Account
                </button>
              </form>

              <p className="auth-switch-text">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setLoginForm(true);
                    setPasswordVisible(false);
                  }}
                  className="auth-switch-btn"
                >
                  Login to Account
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateAccount;
