import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeFromBasket, updateQuantity } from '../../redux/slices/basketSlice';
import styles from './styles.module.css';

const CartBasket = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(product.quantity);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      dispatch(updateQuantity({ id: product.id, quantity: newQuantity }));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromBasket(product.id));
  };

  const currentPrice = product.discont_price || product.price;
  const hasDiscount = product.discont_price && product.discont_price !== product.price;

  return (
    <div className={styles.cartItem}>
      {/* Remove Button */}
      <button 
        onClick={handleRemove}
        className={styles.removeButton}
        aria-label="Remove item"
      >
        <img src="/src/assets/icons/close.svg" alt="close" className={styles.removeIcon} />
      </button>

      {/* Product Image */}
      <div className={styles.imageContainer}>
        <img 
          src={`http://localhost:3333${product.image}`} 
          alt={product.title}
          className={styles.productImage}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Product Info */}
      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{product.title}</h3>
        
        <div className={styles.controlsRow}>
          {/* Quantity Controls */}
          <div className={styles.quantityControls}>
            <button 
              onClick={() => handleQuantityChange(-1)}
              className={styles.quantityButton}
            >
              <img src="/src/assets/icons/minus.svg" alt="minus" className={styles.quantityIcon} />
            </button>
            
            <div className={styles.quantityValue}>
              {quantity}
            </div>
            
            <button 
              onClick={() => handleQuantityChange(1)}
              className={styles.quantityButton}
            >
              <img src="/src/assets/icons/plus.svg" alt="plus" className={styles.quantityIcon} />
            </button>
          </div>

          {/* Price */}
          <div className={styles.priceContainer}>
            <span className={styles.currentPrice}>${currentPrice}</span>
            {hasDiscount && (
              <span className={styles.oldPrice}>${product.price}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartBasket;
