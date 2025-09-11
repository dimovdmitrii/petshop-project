import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  removeFromBasket,
  updateQuantity,
} from "../../redux/slices/basketSlice";
import { API_URL } from "../../config/api";

import styles from "./styles.module.css";

const CartBasket = ({ product }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(product.quantity);

  const handleQuantityChange = (change) => {
    const newQ = quantity + change;
    if (newQ >= 1) {
      setQuantity(newQ);
      dispatch(updateQuantity({ id: product.id, quantity: newQ }));
    }
  };

  const currentPrice = product.discont_price || product.price;
  const hasDiscount =
    product.discont_price && product.discont_price !== product.price;

  return (
    <div className={styles.cartItem}>
      <button
        onClick={() => dispatch(removeFromBasket(product.id))}
        className={styles.removeButton}
        aria-label="Remove item"
      >
        <img
          src="/src/assets/icons/close.svg"
          alt="close"
          className={styles.removeIcon}
        />
      </button>

      <div className={styles.imageContainer}>
        <img
          src={`${API_URL}${product.image}`}
          alt={product.title}
          className={styles.productImage}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>

      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{product.title}</h3>

        <div className={styles.controlsRow}>
          <div className={styles.quantityControls}>
            <button
              onClick={() => handleQuantityChange(-1)}
              className={styles.quantityButton}
            >
              <img
                src="/src/assets/icons/minus.svg"
                alt="minus"
                className={styles.quantityIcon}
              />
            </button>
            <div className={styles.quantityValue}>{quantity}</div>
            <button
              onClick={() => handleQuantityChange(1)}
              className={styles.quantityButton}
            >
              <img
                src="/src/assets/icons/plus.svg"
                alt="plus"
                className={styles.quantityIcon}
              />
            </button>
          </div>

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
