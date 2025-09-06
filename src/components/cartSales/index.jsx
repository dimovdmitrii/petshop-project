import { Link } from 'react-router-dom';
import styles from './styles.module.css';

// Функция для расчета процента скидки
const calculateDiscountPercentage = (originalPrice, discountPrice) => {
  if (!originalPrice || !discountPrice || discountPrice >= originalPrice) {
    return 0;
  }
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
};

const CartSales = ({ product }) => {
  // Вычисляем процент скидки
  const discountPercentage = calculateDiscountPercentage(product.price, product.discont_price);
  const hasDiscount = discountPercentage > 0;

  return (
    <Link to={`/products/${product.id}`} className={styles.productCard}>
      <div className={styles.imageContainer}>
        <img
          src={`http://localhost:3333${product.image}`}
          alt={product.title}
          className={styles.productImage}
        />
        <div className={styles.discountBadge}>
          -{discountPercentage}%
        </div>
      </div>
      
      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{product.title}</h3>
        
        <div className={styles.priceContainer}>
          <span className={styles.currentPrice}>
            ${product.discont_price}
          </span>
          <span className={styles.oldPrice}>${product.price}</span>
        </div>
      </div>
    </Link>
  );
};

export default CartSales;