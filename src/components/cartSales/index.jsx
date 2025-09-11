import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToBasket } from '../../redux/slices/basketSlice';
import { API_URL } from '../../config/api';
import styles from './styles.module.css';

const TIMEOUT_DURATION = 2000;

const calculateDiscountPercentage = (originalPrice, discountPrice) => {
  if (!originalPrice || !discountPrice || discountPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

const getImageSrc = (image) => {
  if (!image) return '/placeholder-image.png';
  return image.startsWith('http') ? image : `${API_URL}${image}`;
};

const getButtonStyles = (isAdded) => ({
  width: '100%',
  backgroundColor: isAdded ? '#282828' : '#0D50FF',
  color: '#fff',
  border: 'none',
  '&:hover': { backgroundColor: '#282828', color: '#fff' },
  fontFamily: 'Montserrat',
  fontSize: '20px',
  fontWeight: 600,
  textTransform: 'none',
  padding: '16px 32px',
  borderRadius: '6px',
  transition: 'all 0.3s ease',
});

const CartSales = ({ product }) => {
  const [isAdded, setIsAdded] = useState(false);
  const dispatch = useDispatch();
  
  const discountPercentage = calculateDiscountPercentage(product.price, product.discont_price);
  const hasDiscount = discountPercentage > 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToBasket({ ...product, quantity: 1 }));
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), TIMEOUT_DURATION);
  };

  return (
    <Link to={`/products/${product.id}`} className={styles.productCard}>
      <div className={styles.imageContainer}>
        <img
          src={getImageSrc(product.image)}
          alt={product.title}
          className={styles.productImage}
          onError={(e) => { e.target.src = '/placeholder-image.png'; }}
        />
        {hasDiscount && (
          <div className={styles.discountBadge}>
            -{discountPercentage}%
          </div>
        )}
        
        <div className={styles.addToCartContainer}>
          <Button 
            className={`${styles.addToCartButton} ${isAdded ? styles.added : ''}`}
            onClick={handleAddToCart}
            sx={getButtonStyles(isAdded)}
          >
            {isAdded ? 'Added' : 'Add to cart'}
          </Button>
        </div>
      </div>
      
      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{product.title}</h3>
        
        <div className={styles.priceContainer}>
          <span className={styles.currentPrice}>
            ${hasDiscount ? product.discont_price : product.price}
          </span>
          {hasDiscount && (
            <span className={styles.oldPrice}>${product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CartSales;