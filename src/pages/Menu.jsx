import React, { useState } from 'react';
import Products from '../components/Products';
import Cart from '../components/Cart';

const Menu = () => {
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem("cart")) || []);

  return (
    <div className="bg--primary">
      <Products cartItems={cartItems} setCartItems={setCartItems} />
      <Cart cartItems={cartItems} setCartItems={setCartItems} />
    </div>
  );
};

export default Menu;
