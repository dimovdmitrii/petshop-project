import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToBasket } from '../../redux/slices/basketSlice';
import styles from './styles.module.css';

// Функция для расчета процента скидки
const calculateDiscountPercentage = (originalPrice, discountPrice) => {
  if (!originalPrice || !discountPrice || discountPrice >= originalPrice) {
    return 0;
  }
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

const CartSales = ({ product }) => {
  const [isAdded, setIsAdded] = useState(false);
  const dispatch = useDispatch();
  
  // Вычисляем процент скидки
  const discountPercentage = calculateDiscountPercentage(product.price, product.discont_price);
  const hasDiscount = discountPercentage > 0;
  
  // Отладочная информация
  console.log('CartSales product:', product);
  console.log('Product has discount:', hasDiscount);
  console.log('Discount percentage:', discountPercentage);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Предотвращаем переход по ссылке
    e.stopPropagation();
    
    // Добавляем товар в корзину через Redux
    dispatch(addToBasket(product));
    console.log('Adding to cart:', product);
    setIsAdded(true);
    
    // Через 2 секунды возвращаем кнопку в исходное состояние
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <Link to={`/products/${product.id}`} className={styles.productCard}>
      <div className={styles.imageContainer}>
        <img
          src={product.image && product.image.startsWith('http') ? product.image : `http://localhost:3333${product.image || '/placeholder-image.png'}`}
          alt={product.title}
          className={styles.productImage}
          onError={(e) => {
            console.log('Image load error for:', product.image);
            e.target.src = '/placeholder-image.png';
          }}
        />
        {hasDiscount && (
          <div className={styles.discountBadge}>
            -{discountPercentage}%
          </div>
        )}
        
        {/* Кнопка Add to cart */}
        <div className={styles.addToCartContainer}>
          <Button
            className={`${styles.addToCartButton} ${isAdded ? styles.added : ''}`}
            onClick={handleAddToCart}
            sx={{
              backgroundColor: isAdded ? '#fff' : '#339933',
              color: isAdded ? '#282828' : '#fff',
              border: isAdded ? '1px solid #282828' : 'none',
              '&:hover': {
                backgroundColor: isAdded ? '#fff' : '#282828',
                color: '#fff',
              },
              fontFamily: 'Montserrat',
              fontSize: '18px',
              fontWeight: 600,
              textTransform: 'none',
              padding: '16px 32px',
              borderRadius: '6px',
              transition: 'all 0.3s ease',
            }}
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