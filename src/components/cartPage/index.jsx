import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Button } from '@mui/material';
import { fetchProductById } from '../../redux/slices/productSlice';
import { addToBasket } from '../../redux/slices/basketSlice';
import { API_URL } from '../../config/api';
import styles from './styles.module.css';

const CartPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, currentProductLoading, currentProductError } = useSelector(state => state.products);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    // Product data loaded
  }, [currentProduct, currentProductLoading, currentProductError]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToBasket({
        id: product.id,
        title: product.title,
        price: product.price,
        discont_price: product.discont_price,
        image: product.image,
        quantity: quantity
      }));
      // Сбрасываем счетчик после добавления
      setQuantity(1);
    }
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  if (currentProductLoading) {
    return (
      <div className={styles.container}>
        <Typography>Загрузка...</Typography>
      </div>
    );
  }

  if (currentProductError || !currentProduct) {
    return (
      <div className={styles.container}>
        <Typography>Продукт не найден</Typography>
        {currentProductError && <Typography>Ошибка: {currentProductError}</Typography>}
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className={styles.container}>
        <Typography>Продукт не найден</Typography>
      </div>
    );
  }

  const product = currentProduct;

  const hasDiscount = product.discont_price && product.discont_price !== product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discont_price) / product.price) * 100)
    : 0;

  // Product data is available
  
  // Category data is available

  const breadcrumbs = [
    { text: 'Main page', link: '/' },
    { text: 'Categories', link: '/categories' },
    ...(product.category ? [
      { 
        text: product.category.title || product.category.name || 'Category', 
        link: `/categories/${product.category.id || product.categoryId}` 
      }
    ] : []),
    { text: product.title ? (product.title.length > 25 ? product.title.substring(0, 25).trim() + '...' : product.title) : 'Product' }
  ];

  const description = product.description || '';
  const shouldTruncate = description.length > 650;
  const displayDescription = showFullDescription || !shouldTruncate 
    ? description 
    : description.substring(0, 650).trim() + '...';

  return (
    <div className={styles.container}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className={styles.breadcrumbItem}>
            {crumb.link ? (
              <Link to={crumb.link} className={styles.breadcrumbLink}>
                {crumb.text}
              </Link>
            ) : (
              <span className={styles.breadcrumbCurrent}>{crumb.text}</span>
            )}
            {index < breadcrumbs.length - 1 && (
              <div className={styles.breadcrumbSeparator}></div>
            )}
          </div>
        ))}
      </div>

      {/* Product Content */}
      <div className={styles.productContent}>
        {/* Product Image */}
        <div className={styles.imageContainer}>
          {product.image ? (
            <img 
              src={`${API_URL}${product.image}`} 
              alt={product.title}
              className={styles.productImage}
              onError={(e) => {
                // Image failed to load
                e.target.style.display = 'none';
              }}
              onLoad={() => {
                // Image loaded successfully
              }}
            />
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              color: '#8B8B8B',
              fontSize: '16px'
            }}>
              No image available
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={styles.productInfo}>
          {/* Product Title */}
          <Typography         
            className={styles.productTitle}
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: { xs: "24px", sm: "32px", md: "40px" },
              fontWeight: 700,
              lineHeight: "110%",
              letterSpacing: 1.2,
              color: "#282828",            
            }}
          >
            {product.title}
          </Typography>

          {/* Price Section */}
          <div className={styles.priceSection}>
            <div className={styles.priceContainer}>
              <Typography                
                className={styles.currentPrice}
                sx={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: { xs: "28px", sm: "46px", md: "64px" },
                  fontWeight: 700,
                  lineHeight: "110%",                  
                  color: "#282828"
                }}
              >
                ${product.discont_price || product.price}
              </Typography>
              
              {hasDiscount && (
                <>
                  <Typography 
                    variant="body1"
                    className={styles.oldPrice}
                    sx={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: { xs: "20px", sm: "32px", md: "40px" },
                      fontWeight: 500,
                      color: "#8B8B8B",
                      textDecoration: "line-through",
                      marginLeft: "32px"
                    }}
                  >
                    ${product.price}
                  </Typography>
                  
                  <div className={styles.discountBadge}>
                    <Typography 
                      variant="body2"
                      sx={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: { xs: "10px", sm: "14px", md: "20px" },
                        fontWeight: 600,
                        color: "white"
                      }}
                    >
                      -{discountPercent}%
                    </Typography>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className={styles.quantitySection}>
            <div className={styles.quantityContainer}>
                            
              <div className={styles.quantityControls}>
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className={styles.quantityButton}
                >
                  <img src="/src/assets/icons/minus.svg" alt="minus" className={styles.quantityIcon} />
                </button>
                
                <Typography 
                  variant="body1"
                  className={styles.quantityValue}
                >
                  {quantity}
                </Typography>
                
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className={styles.quantityButton}
                >
                  <img src="/src/assets/icons/plus.svg" alt="plus" className={styles.quantityIcon} />
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              variant="contained"
              className={styles.addToCartButton}
              sx={{
                backgroundColor: "#0D50FF",
                borderRadius: "6px",
                fontFamily: 'Montserrat, sans-serif',
                fontSize: "20px",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  background: "#2d7a2d",
                }
              }}
            >
              Add to cart
            </Button>
          </div>

          {/* Description */}
          <div className={styles.descriptionSection}>
            <Typography               
              className={styles.descriptionTitle}
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: "20px",
                fontWeight: 600,
                lineHeight: "130%",
                color: "#282828",
                marginBottom: "16px"
              }}
            >
              Description
            </Typography>
            
            <Typography               
              className={styles.descriptionText}
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: "16px",
                fontWeight: 400,
                overflow: "hidden",
                color:  "#282828",                   
                lineHeight: "130%"
              }}
            >
              {displayDescription}
            </Typography>
            
            {shouldTruncate && (
              <Button
                onClick={toggleDescription}
                className={styles.readMoreButton}
                sx={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#339933",
                  textTransform: "none",
                  padding: "8px 0",
                  textDecoration: "underline",
                  "&:hover": {
                    textDecoration: "underline",
                    background: "transparent"
                  }
                }}
              >
                {showFullDescription ? 'Read less' : 'Read more'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;