import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import CartCategories from '../../components/cartCategories';
import { API_URL } from '../../config/api';
import styles from './styles.module.css';

// Simple responsive font size
const getTitleSize = () => {
  const width = window.innerWidth;
  if (width <= 900) return '24px';
  if (width <= 1200) return '36px';
  return '64px';
};

const Categories = () => {
  const [state, setState] = useState({ data: [], loading: true, error: null });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        const response = await fetch(`${API_URL}/categories/all`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (err) {
        setState({ data: [], loading: false, error: err.message });
      }
    };
    fetchCategories();
  }, []);

  if (state.loading) {
    return (
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.loading}>Loading categories...</div>
        </div>
      </main>
    );
  }

  if (state.error) {
    return (
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.error}>Error: {state.error}</div>
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
          {state.data.map((category) => (
            <CartCategories key={category.id} category={category} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Categories;
