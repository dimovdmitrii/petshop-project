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
        console.log('All products from API:', allProducts); // Для отладки
        
        // Фильтруем товары со скидкой (у которых есть и price, и discountPrice)
        const productsWithDiscount = allProducts.filter(product => {
          console.log('Checking product:', product.title, 'price:', product.price, 'discountPrice:', product.discountPrice);
          return product.price && product.discountPrice && product.discountPrice < product.price;
        });
        
        console.log('Products with discount:', productsWithDiscount); // Для отладки
        
        // Берем случайные 4 товара
        let selectedProducts;
        if (productsWithDiscount.length > 0) {
          const shuffled = productsWithDiscount.sort(() => 0.5 - Math.random());
          selectedProducts = shuffled.slice(0, 4);
        } else {
          // Если нет товаров со скидкой, берем любые 4 товара
          console.log('No products with discount found, showing any 4 products');
          const shuffled = allProducts.sort(() => 0.5 - Math.random());
          selectedProducts = shuffled.slice(0, 4);
        }
        
        console.log('Selected products for display:', selectedProducts); // Для отладки
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
        fontSize: '64px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '110%',
        color: '#282828',
        margin: 0,
        backgroundColor: '#fff',
        paddingRight: '20px',
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
