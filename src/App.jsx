import Navbar from './components/Navbar';
import Landing from './components/Landing';
import './styles/global.css';
import Products from './components/Products';
import { useEffect, useState } from 'react';
import { menuData } from './services/service';
import { Skeleton } from '@mui/material';

function App() {
  const [products, setProducts] = useState([])

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await menuData();
        setProducts(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, [])

  console.log(products)

  return (
    <>
      <Navbar />
      <Landing />
      <Products products={products} />
    </>
  )
}

export default App;
