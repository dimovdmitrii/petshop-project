import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import CartCategories from '../../components/cartCategories';
import { API_URL } from '../../config/api';
import styles from './styles.module.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/categories/all`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.loading}>Loading categories...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.error}>Error: {error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.breadcrumbs}>
          <Link to="/" className={styles.breadcrumbLink}>
            Main page
          </Link>
          <span className={styles.breadcrumbSeparator}>  </span>
          <span className={styles.breadcrumbCurrent}>Categories</span>
        </div>

        <Typography 
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: {
              xs: '24px',
              sm: '28px', 
              md: '36px',
              lg: '64px',
              xl: '64px'
            },
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '110%',
            color: '#282828',
            margin: '0 0 40px 0',
          }}
          className={styles.title}
        >
          Categories
        </Typography>

        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <CartCategories key={category.id} category={category} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Categories;
