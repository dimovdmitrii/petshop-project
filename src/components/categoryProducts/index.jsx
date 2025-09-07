import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, TextField, FormControlLabel, Checkbox, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CartSales from '../cartSales';
import styles from './styles.module.css';

const CategoryProducts = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  
  // Фильтры
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [discountedOnly, setDiscountedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3333/categories/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        
        // Обрабатываем данные с API
        let productsData = [];
        let categoryName = '';

        if (Array.isArray(data)) {
          productsData = data;
          if (data.length > 0 && data[0].category) {
            categoryName = data[0].category.title || data[0].category.name;
          }
        } else if (data.data && Array.isArray(data.data)) {
          // API возвращает {category: {...}, data: [...]}
          productsData = data.data;
          if (data.category) {
            categoryName = data.category.title || data.category.name;
          } else if (data.data.length > 0 && data.data[0].category) {
            categoryName = data.data[0].category.title || data.data[0].category.name;
          }
        } else if (data.products && Array.isArray(data.products)) {
          productsData = data.products;
          if (data.products.length > 0 && data.products[0].category) {
            categoryName = data.products[0].category.title || data.products[0].category.name;
          }
        } else if (data.title || data.name) {
          categoryName = data.title || data.name;
        }

        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategoryName(categoryName);
      } catch (err) {
        setError(err.message);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProducts();
    }
  }, [id]);

  // Функция фильтрации и сортировки
  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Применяем фильтры
    filtered = filtered.filter(product => {
      // Фильтр по цене
      if (priceFrom && product.price < parseFloat(priceFrom)) return false;
      if (priceTo && product.price > parseFloat(priceTo)) return false;
      
      // Фильтр по скидке
      if (discountedOnly && (!product.discont_price || product.discont_price >= product.price)) {
        return false;
      }
      
      return true;
    });

    // Применяем сортировку
    if (sortBy !== 'default') {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          case 'price-high-low':
            return (b.discont_price || b.price) - (a.discont_price || a.price);
          case 'price-low-high':
            return (a.discont_price || a.price) - (b.discont_price || b.price);
          default:
            return 0;
        }
      });
    }

    setFilteredProducts(filtered);
  };

  // Применяем фильтры при изменении
  useEffect(() => {
    applyFiltersAndSort();
  }, [products, priceFrom, priceTo, discountedOnly, sortBy]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error}</div>
        <Link to="/" className={styles.backLink}>Back to Home</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Хлебные крошки */}
      <div className={styles.breadcrumbs}>
        <Link to="/" className={styles.breadcrumbLink}>Main page</Link>
        <span className={styles.breadcrumbSeparator}></span>
        <Link to="/categories" className={styles.breadcrumbLink}>Categories</Link>
        <span className={styles.breadcrumbSeparator}></span>
        <span className={styles.breadcrumbCurrent}>{categoryName}</span>
      </div>

      {/* Заголовок */}
      <Typography 
        variant="h1" 
        className={styles.title}
        sx={{
          fontSize: { xs: "24px", sm: "32px", md: "48px", lg: "64px" },
          fontWeight: 700,
          color: "#282828",
          margin: "0 0 40px 0",
          lineHeight: "110%"
        }}
      >
        {categoryName}
      </Typography>

      {/* Фильтры */}
      <Box className={styles.filtersContainer}>
        <Box className={styles.priceFilter}>
          <Typography variant="body1" className={styles.filterLabel}>Price</Typography>
          <TextField
            type="number"
            placeholder="from"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
            size="small"
            sx={{ width: "100px", marginRight: "8px" }}
          />
          <TextField
            type="number"
            placeholder="to"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            size="small"
            sx={{ width: "100px" }}
          />
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={discountedOnly}
              onChange={(e) => setDiscountedOnly(e.target.checked)}
            />
          }
          label="Discounted items"
          className={styles.discountCheckbox}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sorted</InputLabel>
          <Select
            value={sortBy}
            label="Sorted"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="default">by default</MenuItem>
            <MenuItem value="newest">newest</MenuItem>
            <MenuItem value="price-high-low">price: high-low</MenuItem>
            <MenuItem value="price-low-high">price: low-high</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Сетка продуктов */}
      {!Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
        <div className={styles.noProducts}>
          <p>No products found in this category.</p>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <CartSales key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
