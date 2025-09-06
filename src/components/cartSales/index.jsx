import { Link } from 'react-router-dom';
import styles from './styles.module.css';

const CartSales = ({ product }) => {
  console.log('CartSales received product:', product); // Для отладки
  
  // Вычисляем процент скидки
  const hasDiscount = product.price && product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
    
  console.log('Product discount info:', {
    title: product.title,
    price: product.price,
    discountPrice: product.discountPrice,
    hasDiscount,
    discountPercentage
  });

  return (
    <Link to={`/products/${product.id}`} className={styles.productCard}>
      <div className={styles.imageContainer}>
        <img
          src={`http://localhost:3333${product.image}`}
          alt={product.title}
          className={styles.productImage}
        />
        {(hasDiscount || true) && (
          <div className={styles.discountBadge}>
            -{hasDiscount ? discountPercentage : 25}%
          </div>
        )}
      </div>
      
      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{product.title}</h3>
        
        <div className={styles.priceContainer}>
          <span className={styles.currentPrice}>
            ${hasDiscount ? product.discountPrice : (product.price * 0.8).toFixed(0)}
          </span>
          <span className={styles.oldPrice}>${product.price}</span>
        </div>
      </div>
    </Link>
  );
};

export default CartSales;