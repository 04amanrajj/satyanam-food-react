import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RestaurantProvider, useRestaurant } from "./contexts/RestaurantContext"; // Import Context Provider
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from "./pages/Profile";
import Menu from "./pages/Menu";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Footer from "./components/Footer";
import NotFound from "./pages/notfound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import './styles/global.css';
import { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav";
import CartDrawer from "./components/CartDrawer";

function AppContent() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkmode") || false);
  const { cartOpen, setCartOpen } = useRestaurant();

  useEffect(() => {
    const theme = darkMode ? true : false;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("darkmode", theme);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} toggleDarkMode={toggleDarkMode} onCartOpen={() => setCartOpen(true)} />
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/menu" element={<Menu darkMode={darkMode} setDarkMode={setDarkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/user" element={<Profile darkMode={darkMode} setDarkMode={setDarkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/about" element={<About darkMode={darkMode} setDarkMode={setDarkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/checkout" element={<Checkout darkMode={darkMode} setDarkMode={setDarkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound darkMode={darkMode} setDarkMode={setDarkMode} toggleDarkMode={toggleDarkMode} />} />
      </Routes>
      <BottomNav onCartOpen={() => setCartOpen(true)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Footer />
    </Router>
  );
}

function App() {
  return (
    <RestaurantProvider>
      <AppContent />
    </RestaurantProvider>
  );
}

export default App;
