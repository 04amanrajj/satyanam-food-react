import { Alert, Snackbar } from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CreateAccount = () => {
  const [randomImageNumber, setRandomImageNumber] = useState(Math.floor(Math.random() * 4) + 1)
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [username, setUsername] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [open, setOpen] = useState(false);
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
    // Add form submission logic here
  };

  useEffect(() => {
    if (username) {
      const delayDebounceFn = setTimeout(() => {
        // Simulate an API call to check username availability
        setCheckingUsername(true);
        setTimeout(() => {
          setIsUsernameAvailable(username.length !== 0 && username.length > 6);
          setCheckingUsername(false);
        }, 1000);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [username]);

  const getDaysInMonth = (month, year) => {
    if (month === "February") {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
    }
    return ["April", "June", "September", "November"].includes(month) ? 30 : 31;
  };

  const days = [
    ...Array(getDaysInMonth(selectedMonth, selectedYear)).keys(),
  ].map((day) => day + 1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const isFormValid = () => {
    return (
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
      >
        <Alert severity="success" onClose={() => setOpen(false)}>
          This is a success alert!
        </Alert>
      </Snackbar>
    );
  };


  return (
    <div className="flex-col md:flex-row flex h-100vh m-auto w-full justify-center">
      <div
        className="hidden md:flex w-3/4 h-min bg-cover rounded-l-3xl bg-center"
        style={{ backgroundImage: `url('/coverpage/img${randomImageNumber}.jpeg')` }}
      >
      </div>
      <div className="flex items-center">
        <div className="bg-white p-8 rounded-3xl md:rounded-r-3xl md:rounded-l-none shadow-lg w-full">
          <h2 className="text-2xl font-bold mb-6">Create Account</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Your Name</label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-1/2 p-2 border rounded-lg"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-1/2 p-2 border rounded-lg"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full p-2 border rounded-lg"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <i className="fas fa-envelope absolute right-3 top-3 text-gray-400"></i>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="username123"
                  className="w-full p-2 border rounded-lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <span className="absolute right-3 top-3 text-green-500 flex items-center">
                  {checkingUsername ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : isUsernameAvailable ? (
                    <i className="fas fa-check-circle"></i>
                  ) : (
                    <i className="fas fa-times-circle text-red-500"></i>
                  )}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Gender</label>
              <select
                className="w-full p-2 border rounded-lg"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option>Female</option>
                <option>Male</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Birthday</label>
              <div className="flex space-x-4">
                <select
                  className="w-1/3 p-2 border rounded-lg"
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                >
                  <option value="">Day</option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <select
                  className="w-1/3 p-2 border rounded-lg"
                  name="month"
                  value={formData.month}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    handleChange(e);
                  }}
                >
                  <option value="">Month</option>
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
                  ].map((month, index) => (
                    <option key={index} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  className="w-1/3 p-2 border rounded-lg"
                  name="year"
                  value={formData.year}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    handleChange(e);
                  }}
                >
                  <option value="">Year</option>
                  {Array.from(
                    { length: 100 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="********"
                  className="w-full p-2 border rounded-lg"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <i
                  className={`fas ${passwordVisible ? "fa-eye-slash" : "fa-eye"
                    } absolute right-3 top-3 text-gray-400 cursor-pointer`}
                  onClick={() => setPasswordVisible(!passwordVisible)}
                ></i>
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
              />
              <label className="text-gray-700">
                Agree with{" "}
                <a href=" " className="text-blue-500">
                  Terms & Conditions
                </a>
              </label>
            </div>
            <button
              className="w-full bg-green-500 text-white p-2 rounded-lg"
              disabled={!isFormValid()}
            >
              Create Account
            </button>
          </form>
          <p className="mt-4 text-center text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Login to Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
