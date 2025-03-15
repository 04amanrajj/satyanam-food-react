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

function App() {

  return (
    <RestaurantProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/user" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Footer />
    </RestaurantProvider>
  );
}

export default App;
