import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, TextField, FormControlLabel, Checkbox, Select, MenuItem, FormControl } from '@mui/material';
import { styled } from '@mui/material/styles';
import CartSales from '../cartSales';
import { 
  fetchAllProducts, 
  fetchProductsByCategory, 
  setPriceFrom, 
  setPriceTo, 
  setDiscountedOnly, 
  setSortBy,
  setCurrentContext,
  setSalesMode,
  applyFilters,
  clearAllProductsError,
  clearCategoryProductsError
} from '../../redux/slices/productSlice';
import styles from './styles.module.css';

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
      dispatch(setCurrentContext('all'));
      dispatch(setSalesMode(!showDiscountFilter));
      if (allProducts.length === 0) {
        dispatch(fetchAllProducts());
      }
    } else if (apiEndpoint.includes('/categories/')) {
      dispatch(setCurrentContext('category'));
      dispatch(setSalesMode(false));
      const categoryId = apiEndpoint.split('/categories/')[1];
      dispatch(fetchProductsByCategory(categoryId));
    }
  }, [apiEndpoint, dispatch, allProducts.length, showDiscountFilter]);

  useEffect(() => {
    if (products.length > 0) {
      dispatch(applyFilters());
    }
  }, [products, filters, dispatch]);

  const handlePriceFromChange = (e) => {
    dispatch(setPriceFrom(e.target.value));
  };

  const handlePriceToChange = (e) => {
    dispatch(setPriceTo(e.target.value));
  };

  const handleDiscountedChange = (e) => {
    dispatch(setDiscountedOnly(e.target.checked));
  };

  const handleSortChange = (e) => {
    dispatch(setSortBy(e.target.value));
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
        sx={TYPOGRAPHY_STYLES.title}
      >
        {finalTitle}
      </Typography>

      {showFilters && (
        <Box className={styles.filtersContainer}>
        <Box className={styles.priceFilter}>
          <Typography sx={TYPOGRAPHY_STYLES.filterLabel} className={styles.filterLabel}>Price</Typography>
          <TextField
            type="number"
            placeholder="from"
            value={filters.priceFrom}
            onChange={handlePriceFromChange}
            size="small"
            sx={{ 
              ...TEXT_FIELD_STYLES,
              marginRight: "8px",
            }}
          />
          <TextField
            type="number"
            placeholder="to"
            value={filters.priceTo}
            onChange={handlePriceToChange}
            size="small"
            sx={TEXT_FIELD_STYLES}
          />
        </Box>

        {showDiscountFilter && (
          <FormControlLabel
            control={
              <CustomCheckbox
                checked={filters.discountedOnly}
                onChange={handleDiscountedChange}
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
              gap: '16px',
              '& .MuiFormControlLabel-label': {
                marginLeft: 0,
              }
            }}
          />
        )}

        <Box className={styles.sortContainer}>
          <Typography sx={TYPOGRAPHY_STYLES.filterLabel} className={styles.filterLabel}>Sorted</Typography>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={filters.sortBy}
              onChange={handleSortChange}
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
