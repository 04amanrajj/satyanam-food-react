import Navbar from './components/Navbar';
import Landing from './components/Landing';
import './styles/global.css';
import Products from './components/Products';
import {  useState } from 'react';

function App() {
  const [showMenu, setShowMenu] = useState([false]);
  console.log(showMenu)
  return (
    <>
      <Navbar />
      <Landing showMenu={showMenu} setShowMenu={setShowMenu} />
      {showMenu && <Products />}
      </>
  )
}

export default App;
