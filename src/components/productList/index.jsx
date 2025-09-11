import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, TextField, FormControlLabel, Checkbox, Select, MenuItem, FormControl } from '@mui/material';
import { styled } from '@mui/material/styles';
import CartSales from '../cartSales';
import { 
  fetchAllProducts, 
  fetchProductsByCategory, 
  setFilter,
  setContext,
  applyFilters,
  clearError
} from '../../redux/slices/productSlice';
import styles from './styles.module.css';

const commonStyle = {
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 500
};

const titleStyle = {
  ...commonStyle,
  fontSize: { xs: "24px", sm: "32px", md: "64px" },
  fontWeight: 700,
  color: "#282828",
  lineHeight: "110%",
  margin: "40px 0"
};

const filterStyle = {
  ...commonStyle,
  color: '#282828',
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: '130%'
};

const inputStyle = {
  width: "112px",
  height: "36px",
  '& .MuiInputBase-root': {
    height: "36px",
    borderRadius: "6px",
    border: "1px solid #DDD",
    padding: "8px 16px",
  },
  '& .MuiInputBase-input': {
    ...commonStyle,
    fontSize: '16px',
    padding: 0,
  },
  '& .MuiInputBase-input::placeholder': {
    ...commonStyle,
    fontSize: '16px',
    opacity: 0.7,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  }
};

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

const ProductList = ({ 
  title, 
  breadcrumbs, 
  apiEndpoint, 
  showFilters = true,
  showDiscountFilter = true,
  dynamicTitle = false,
  dynamicBreadcrumbs = false
}) => {
  const dispatch = useDispatch();
  
  const {
    allProducts,
    categoryProducts,
    filteredProducts,
    filters,
    allProductsLoading,
    categoryProductsLoading,
    allProductsError,
    categoryProductsError,
    currentCategory
  } = useSelector(state => state.products);

  const isLoading = apiEndpoint.includes('/products/all') ? allProductsLoading : categoryProductsLoading;
  const error = apiEndpoint.includes('/products/all') ? allProductsError : categoryProductsError;
  const products = apiEndpoint.includes('/products/all') ? allProducts : categoryProducts;

  const finalBreadcrumbs = dynamicBreadcrumbs && currentCategory 
    ? [
        { text: 'Main page', link: '/' },
        { text: 'Categories', link: '/categories' },
        { text: currentCategory.title || currentCategory.name || 'Category' }
      ]
    : breadcrumbs;

  const finalTitle = dynamicTitle && currentCategory 
    ? (currentCategory.title || currentCategory.name || 'Category Products')
    : title;

  useEffect(() => {
    if (apiEndpoint.includes('/products/all')) {
      dispatch(setContext({ context: 'all', salesMode: !showDiscountFilter }));
      if (allProducts.length === 0) {
        dispatch(fetchAllProducts());
      }
    } else if (apiEndpoint.includes('/categories/')) {
      dispatch(setContext({ context: 'category', salesMode: false }));
      const categoryId = apiEndpoint.split('/categories/')[1];
      dispatch(fetchProductsByCategory(categoryId));
    }
  }, [apiEndpoint, dispatch, allProducts.length, showDiscountFilter]);

  useEffect(() => {
    if (products.length > 0) {
      dispatch(applyFilters());
    }
  }, [products, filters, dispatch]);

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ key, value }));
  };

  if (isLoading) {
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
      <div className={styles.breadcrumbs}>
        {finalBreadcrumbs.map((crumb, index) => (
          <div key={index} className={styles.breadcrumbItem}>
            {crumb.link ? (
              <Link to={crumb.link} className={styles.breadcrumbLink}>
                {crumb.text}
              </Link>
            ) : (
              <span className={styles.breadcrumbCurrent}>{crumb.text}</span>
            )}
            {index < finalBreadcrumbs.length - 1 && (
              <span className={styles.breadcrumbSeparator}></span>
            )}
          </div>
        ))}
      </div>

      <Typography 
        className={styles.title}
        sx={titleStyle}
      >
        {finalTitle}
      </Typography>

      {showFilters && (
        <Box className={styles.filtersContainer}>
        <Box className={styles.priceFilter}>
          <Typography sx={filterStyle} className={styles.filterLabel}>Price</Typography>
          <TextField
            type="number"
            placeholder="from"
            value={filters.priceFrom}
            onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
            size="small"
            sx={{ ...inputStyle, marginRight: "8px" }}
          />
          <TextField
            type="number"
            placeholder="to"
            value={filters.priceTo}
            onChange={(e) => handleFilterChange('priceTo', e.target.value)}
            size="small"
            sx={inputStyle}
          />
        </Box>

        {showDiscountFilter && (
          <FormControlLabel
            control={
              <CustomCheckbox
                checked={filters.discountedOnly}
                onChange={(e) => handleFilterChange('discountedOnly', e.target.checked)}
              />
            }
            label={
              <Typography sx={filterStyle}>
                Discounted items
              </Typography>
            }
            labelPlacement="start"
            sx={{
              margin: 0,
              gap: '16px',
              '& .MuiFormControlLabel-label': {
                marginLeft: 0,
              }
            }}
          />
        )}

        <Box className={styles.sortContainer}>
          <Typography sx={filterStyle} className={styles.filterLabel}>Sorted</Typography>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              displayEmpty
              sx={{
                width: '200px',
                height: '36px',
                '& .MuiSelect-select': {
                  ...commonStyle,
                  fontSize: '16px',
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
              <MenuItem value="default" sx={commonStyle}>by default</MenuItem>
              <MenuItem value="newest" sx={commonStyle}>newest</MenuItem>
              <MenuItem value="price-high-low" sx={commonStyle}>price: high-low</MenuItem>
              <MenuItem value="price-low-high" sx={commonStyle}>price: low-high</MenuItem>
            </Select>
          </FormControl>
        </Box>
        </Box>
      )}

      {!Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
        <div className={styles.noProducts}>
          <p>No products found.</p>
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

export default ProductList;
