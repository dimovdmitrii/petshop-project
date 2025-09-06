import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import CartSales from '../cartSales';
import styles from './styles.module.css';

const MainPageSales = () => {
  const [salesProducts, setSalesProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3333/products/all');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const allProducts = await response.json();
        console.log('All products:', allProducts);
        
        // Фильтруем товары со скидкой (у которых есть и price, и discont_price, и discont_price не null)
        const productsWithDiscount = allProducts.filter(product => 
          product.price && 
          product.discont_price && 
          product.discont_price !== null && 
          product.discont_price < product.price
        );
        
        console.log('Products with discount:', productsWithDiscount);
        
        // Берем случайные 4 товара только из товаров со скидкой
        const shuffled = productsWithDiscount.sort(() => 0.5 - Math.random());
        const selectedProducts = shuffled.slice(0, 4);
        
        console.log('Selected products:', selectedProducts);
        setSalesProducts(selectedProducts);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching sales products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesProducts();
  }, []);

  if (loading) {
    return (
      <section className={styles.salesSection}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading sales products...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.salesSection}>
        <div className={styles.container}>
          <div className={styles.error}>Error: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.salesSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Typography sx={{
        fontFamily: 'Montserrat, sans-serif',
        fontSize: {
          xs: '24px',
          sm: '28px', 
          md: '34px',
          lg: '64px',
          xl: '64px'
        },
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '110%',
        color: '#282828',
        margin: 0,
        backgroundColor: '#fff',
        paddingRight: {
          xs: 0,
          sm: 0,
          md: '20px'
        },
        position: 'relative',
        zIndex: 1,
      }} className={styles.title}>Sale</Typography>
          <Link to="/sales" className={styles.allSalesBtn}>
            All sales
          </Link>
        </div>

        <div className={styles.productsGrid}>
          {salesProducts.map((product) => (
            <CartSales key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MainPageSales;
