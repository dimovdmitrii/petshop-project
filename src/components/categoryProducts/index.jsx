import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, TextField, FormControlLabel, Checkbox, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import CartSales from '../cartSales';
import styles from './styles.module.css';

// Константы стилей
const TYPOGRAPHY_STYLES = {
  title: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: { xs: "24px", sm: "32px", md: "64px", lg: "64px" },
    fontWeight: 700,
    color: "#282828",          
    lineHeight: "110%",
    margin: "40px 0 40px 0"
  },
  filterLabel: {
    color: '#282828',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '130%',
  },
  menuItem: {
    fontFamily: 'Montserrat',
    fontSize: '16px',
    fontWeight: 500,
  }
};

const TEXT_FIELD_STYLES = {
  width: "112px",
  height: "36px",
  '& .MuiInputBase-root': {
    height: "36px",
    borderRadius: "6px",
    border: "1px solid #DDD",
    padding: "8px 16px",
  },
  '& .MuiInputBase-input': {
    fontFamily: 'Montserrat',
    fontSize: '16px',
    fontWeight: 500,
    padding: 0,
  },
  '& .MuiInputBase-input::placeholder': {
    fontFamily: 'Montserrat',
    fontSize: '16px',
    fontWeight: 500,
    opacity: 0.7,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  }
};

// Кастомные стили для чекбокса
const CustomCheckboxIcon = styled('span')(({ theme }) => ({
  borderRadius: 6,
  width: 36,
  height: 36,
  border: '1px solid #DDD',
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));

const CustomCheckedIcon = styled(CustomCheckboxIcon)({
  backgroundColor: '#0D50FF',
  border: '1px solid #0D50FF',
  '&::before': {
    display: 'block',
    width: 36,
    height: 36,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: '20px 20px',
  },
  '&:hover': {
    backgroundColor: '#0B45E6',
  },
});

// Кастомный чекбокс компонент
function CustomCheckbox(props) {
  return (
    <Checkbox
      sx={{ '&:hover': { bgcolor: 'transparent' } }}
      disableRipple
      color="default"
      checkedIcon={<CustomCheckedIcon />}
      icon={<CustomCheckboxIcon />}
      {...props}
    />
  );
}

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

        // Определяем источник данных
        if (Array.isArray(data)) {
          productsData = data;
        } else if (data.data && Array.isArray(data.data)) {
          productsData = data.data;
        } else if (data.products && Array.isArray(data.products)) {
          productsData = data.products;
        }

        // Определяем название категории
        if (data.category) {
          categoryName = data.category.title || data.category.name;
        } else if (data.title || data.name) {
          categoryName = data.title || data.name;
        } else if (productsData.length > 0 && productsData[0].category) {
          categoryName = productsData[0].category.title || productsData[0].category.name;
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
      // Определяем текущую цену (со скидкой или без)
      const currentPrice = product.discont_price || product.price;
      
      // Фильтр по цене (используем текущую цену)
      if (priceFrom && currentPrice < parseFloat(priceFrom)) return false;
      if (priceTo && currentPrice > parseFloat(priceTo)) return false;
      
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
        className={styles.title}
        sx={TYPOGRAPHY_STYLES.title}
      >
        {categoryName}
      </Typography>

      {/* Фильтры */}
      <Box className={styles.filtersContainer}>
        <Box className={styles.priceFilter}>
          <Typography sx={TYPOGRAPHY_STYLES.filterLabel} className={styles.filterLabel}>Price</Typography>
          <TextField
            type="number"
            placeholder="from"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
            size="small"
            sx={{ 
              ...TEXT_FIELD_STYLES,
              marginRight: "8px",
            }}
          />
          <TextField
            type="number"
            placeholder="to"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            size="small"
            sx={TEXT_FIELD_STYLES}
          />
        </Box>

        <FormControlLabel
          control={
            <CustomCheckbox
              checked={discountedOnly}
              onChange={(e) => setDiscountedOnly(e.target.checked)}
            />
          }
          label={
            <Typography sx={TYPOGRAPHY_STYLES.filterLabel}>
              Discounted items
            </Typography>
          }
          labelPlacement="start"
          sx={{
            margin: 0,
            gap: '16px', // Добавляем отступ 16px между лейблом и чекбоксом
            '& .MuiFormControlLabel-label': {
              marginLeft: 0,
            }
          }}
        />

        <Box className={styles.sortContainer} >
          <Typography sx={TYPOGRAPHY_STYLES.filterLabel} className={styles.filterLabel}>Sorted</Typography>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              displayEmpty
              sx={{
                width: '200px',
                height: '36px',
                '& .MuiSelect-select': {
                  fontFamily: 'Montserrat',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#282828',
                  padding: '8px 8px 8px 16px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid #DDD',
                  borderRadius: '6px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#282828',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#282828',
                }
              }}
            >
              <MenuItem value="default" sx={TYPOGRAPHY_STYLES.menuItem}>
                by default
              </MenuItem>
              <MenuItem value="newest" sx={TYPOGRAPHY_STYLES.menuItem}>
                newest
              </MenuItem>
              <MenuItem value="price-high-low" sx={TYPOGRAPHY_STYLES.menuItem}>
                price: high-low
              </MenuItem>
              <MenuItem value="price-low-high" sx={TYPOGRAPHY_STYLES.menuItem}>
                price: low-high
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
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
