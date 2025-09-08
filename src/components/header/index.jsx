import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoIcon from "../../assets/icons/logo.svg";
import CartIcon from "../../assets/icons/basket=empty.svg";
import styles from "./styles.module.css";

const Header = () => {
  const navigate = useNavigate();
  const { count } = useSelector(state => state.basket);

  const handleCartClick = () => {
    navigate("/basket");
  };

  const navLinks = [
    { to: "/", label: "Main Page" },
    { to: "/categories", label: "Categories" },
    { to: "/products", label: "All products" },
    { to: "/sales", label: "All sales" },
  ];

  return (
    <header className={styles.header}>
      <NavLink to="/">
        <img
          src={LogoIcon}
          alt="Logo"
          className={styles.logo}
          style={{ cursor: "pointer" }}
        />
      </NavLink>

      <nav className={styles.nav}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? `${styles.active}` : undefined
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div
        className={styles.cartIconWrapper}
        onClick={handleCartClick}
        style={{ cursor: "pointer" }}
      >
        <img src={CartIcon} alt="Cart" className={styles.cartIcon} />
        {count > 0 && <span className={styles.cartCount}>{count}</span>}
      </div>
    </header>
  );
};

export default Header;
