import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // импортируем необходимые хуки и компоненты
import LogoIcon from "../../assets/icons/logo.svg";
import CartIcon from "../../assets/icons/basket=empty.svg";
import styles from "./styles.module.css";

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate(); // для программной навигации

  useEffect(() => {
    const savedCartCount = localStorage.getItem("cartCount");
    if (savedCartCount) {
      setCartCount(Number(savedCartCount));
    }
  }, []);

  const updateCartCount = (count) => {
    setCartCount(count);
    localStorage.setItem("cartCount", count);
  };

  // Обработчик клика по корзине
  const handleCartClick = () => {
    navigate("/basket");
  };

  return (
    <header className={styles.header}>
      <Link to="/">
        <img
          src={LogoIcon}
          alt="Logo"
          className={styles.logo}
          style={{ cursor: "pointer" }}
        />
      </Link>

      <nav className={styles.nav}>
        <Link to="/">Main Page</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/products">All products</Link>
        <Link to="/sales">All sales</Link>
      </nav>

      <div
        className={styles.cartIconWrapper}
        onClick={handleCartClick}
        style={{ cursor: "pointer" }}
      >
        <img src={CartIcon} alt="Cart" className={styles.cartIcon} />
        {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
      </div>
    </header>
  );
};

export default Header;
