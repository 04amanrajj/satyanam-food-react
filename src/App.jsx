import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RestaurantProvider } from "./contexts/RestaurantContext"; // Import Context Provider
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from "./pages/Profile";
import Menu from "./pages/Menu";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Footer from "./components/Footer";
import NotFound from "./pages/notfound";
import './styles/global.css';
import { useEffect, useState } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkmode") || false);

  useEffect(() => {
    const theme = darkMode ? true : false;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("darkmode", theme);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <RestaurantProvider>
      <Router>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/menu" element={<Menu darkMode={darkMode} setDarkMode={setDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/user" element={<Profile darkMode={darkMode} setDarkMode={setDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/about" element={<About darkMode={darkMode} setDarkMode={setDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/checkout" element={<Checkout darkMode={darkMode} setDarkMode={setDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="*" element={<NotFound darkMode={darkMode} setDarkMode={setDarkMode} toggleDarkMode={toggleDarkMode} />} />
        </Routes>
      </Router>
      <Footer />
    </RestaurantProvider>
  );
}

export default App;
