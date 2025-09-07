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
        
        // Временные моковые данные для тестирования
        const mockProducts = [
          {
            id: 1,
            title: "BELCANDO Mini Dog Food",
            price: 35,
            discont_price: 23,
            image: "/product_img/belcando.jpg",
            category: { title: "Dry & Wet Food" }
          },
          {
            id: 2,
            title: "GranataPet Mini Royal",
            price: 26,
            discont_price: 15,
            image: "/product_img/granata.jpg",
            category: { title: "Dry & Wet Food" }
          },
          {
            id: 3,
            title: "animonda Carny Dry Cat Food",
            price: 14,
            discont_price: 9,
            image: "/product_img/animonda.jpg",
            category: { title: "Dry & Wet Food" }
          },
          {
            id: 4,
            title: "Dehner Wild Nature Wet Food",
            price: 20,
            image: "/product_img/dehner.jpg",
            category: { title: "Dry & Wet Food" }
          },
          {
            id: 5,
            title: "PERFECT FIT Adult Dry Cat Food",
            price: 28,
            image: "/product_img/perfectfit.jpg",
            category: { title: "Dry & Wet Food" }
          },
          {
            id: 6,
            title: "MERA Pure Sensitive Turkey",
            price: 35,
            image: "/product_img/mera.jpg",
            category: { title: "Dry & Wet Food" }
          },
          {
            id: 7,
            title: "Edgard & Cooper Dog Food",
            price: 12,
            image: "/product_img/edgard.jpg",
            category: { title: "Dry & Wet Food" }
          },
          {
            id: 8,
            title: "Royal Canin Veterinary Renal",
            price: 40,
            discont_price: 35,
            image: "/product_img/royalcanin.jpg",
            category: { title: "Dry & Wet Food" }
          }
        ];
        
        // Попробуем сначала получить данные с API
        try {
          const response = await fetch(`http://localhost:3333/categories/${id}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log('API Response:', data);
            console.log('Response status:', response.status);
            console.log('Data type:', typeof data);
            console.log('Is array:', Array.isArray(data));
            
            // Обрабатываем данные с API
            console.log('Processing API data:', data);
            
            if (Array.isArray(data)) {
              setProducts(data);
              setFilteredProducts(data);
              
              if (data.length > 0 && data[0].category) {
                setCategoryName(data[0].category.title || data[0].category.name);
              }
            } else if (data.data && Array.isArray(data.data)) {
              // API возвращает {category: {...}, data: [...]}
              console.log('Setting products from data.data:', data.data.length);
              setProducts(data.data);
              setFilteredProducts(data.data);
              
              if (data.category) {
                console.log('Setting category name from data.category:', data.category.title || data.category.name);
                setCategoryName(data.category.title || data.category.name);
              } else if (data.data.length > 0 && data.data[0].category) {
                console.log('Setting category name from first product:', data.data[0].category.title || data.data[0].category.name);
                setCategoryName(data.data[0].category.title || data.data[0].category.name);
              }
            } else if (data.products && Array.isArray(data.products)) {
              setProducts(data.products);
              setFilteredProducts(data.products);
              if (data.products.length > 0 && data.products[0].category) {
                setCategoryName(data.products[0].category.title || data.products[0].category.name);
              }
            } else if (data.title || data.name) {
              setCategoryName(data.title || data.name);
              setProducts([]);
              setFilteredProducts([]);
            } else {
              console.log('Unknown data structure:', data);
              setProducts([]);
              setFilteredProducts([]);
            }
          } else {
            throw new Error('API not available');
          }
        } catch (apiError) {
          console.log('API not available, using mock data:', apiError.message);
          
          // Используем моковые данные
          setProducts(mockProducts);
          setFilteredProducts(mockProducts);
          setCategoryName("Dry & Wet Food");
        }
      } catch (err) {
        console.log('Error in fetchProducts:', err);
        setError(err.message);
        setProducts([]); // Устанавливаем пустой массив при ошибке
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
    console.log('Starting filter with products:', products.length);
    let filtered = [...products];
    console.log('Initial filtered length:', filtered.length);

    // Фильтр по цене
    if (priceFrom) {
      filtered = filtered.filter(product => product.price >= parseFloat(priceFrom));
      console.log('After price from filter:', filtered.length);
    }
    if (priceTo) {
      filtered = filtered.filter(product => product.price <= parseFloat(priceTo));
      console.log('After price to filter:', filtered.length);
    }

    // Фильтр по скидке
    if (discountedOnly) {
      filtered = filtered.filter(product => product.discont_price && product.discont_price < product.price);
      console.log('After discount filter:', filtered.length);
    }

    // Сортировка
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'price-high-low':
        filtered.sort((a, b) => (b.discont_price || b.price) - (a.discont_price || a.price));
        break;
      case 'price-low-high':
        filtered.sort((a, b) => (a.discont_price || a.price) - (b.discont_price || b.price));
        break;
      default:
        // По умолчанию - без сортировки
        break;
    }

    console.log('Final filtered length:', filtered.length);
    setFilteredProducts(filtered);
  };

  // Применяем фильтры при изменении
  useEffect(() => {
    console.log('Applying filters:', { products: products.length, priceFrom, priceTo, discountedOnly, sortBy });
    console.log('Products array:', products);
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
          <p>Debug: filteredProducts length = {filteredProducts?.length || 0}</p>
          <p>Debug: products length = {products?.length || 0}</p>
          <p>Debug: loading = {loading.toString()}</p>
          <p>Debug: error = {error || 'none'}</p>
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
