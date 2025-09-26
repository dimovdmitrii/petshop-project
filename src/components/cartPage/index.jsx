import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Button } from "@mui/material";
import { fetchProductById } from "../../redux/slices/productSlice";
import { addToBasket } from "../../redux/slices/basketSlice";
import { API_URL } from "../../config/api";
import minusIcon from "../../assets/icons/minus.svg";
import plusIcon from "../../assets/icons/plus.svg";
import styles from "./styles.module.css";

const STYLES = {
  title: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: { xs: "24px", sm: "32px", md: "40px" },
    fontWeight: 700,
    lineHeight: "110%",
    letterSpacing: 1.2,
    color: "#282828",
  },
  price: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: { xs: "28px", sm: "46px", md: "64px" },
    fontWeight: 700,
    lineHeight: "110%",
    color: "#282828",
  },
  oldPrice: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: { xs: "20px", sm: "32px", md: "40px" },
    fontWeight: 500,
    color: "#8B8B8B",
    textDecoration: "line-through",
    marginLeft: "32px",
  },
  discount: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: { xs: "10px", sm: "14px", md: "20px" },
    fontWeight: 600,
    color: "white",
  },
  descTitle: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "20px",
    fontWeight: 600,
    lineHeight: "130%",
    color: "#282828",
    marginBottom: "16px",
  },
  descText: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "16px",
    fontWeight: 400,
    overflow: "hidden",
    color: "#282828",
    lineHeight: "130%",
  },
  readMore: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "16px",
    fontWeight: 500,
    color: "#339933",
    textTransform: "none",
    padding: "8px 0",
    textDecoration: "underline",
    "&:hover": { textDecoration: "underline", background: "transparent" },
  },
  addToCart: {
    backgroundColor: "#0D50FF",
    borderRadius: "6px",
    fontFamily: "Montserrat, sans-serif",
    fontSize: "20px",
    fontWeight: 600,
    textTransform: "none",
    "&:hover": { background: "#2d7a2d" },
  },
  placeholder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#8B8B8B",
    fontSize: "16px",
  },
};

const getBreadcrumbs = (p) => [
  { text: "Main page", link: "/" },
  { text: "Categories", link: "/categories" },
  ...(p.category
    ? [
        {
          text: p.category.title || p.category.name || "Category",
          link: `/categories/${p.category.id || p.categoryId}`,
        },
      ]
    : []),
  {
    text: p.title
      ? p.title.length > 25
        ? p.title.substring(0, 25).trim() + "..."
        : p.title
      : "Product",
  },
];

const getDesc = (d, show) =>
  !d ? "" : show || d.length <= 650 ? d : d.substring(0, 650).trim() + "...";

const CartPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, currentProductLoading, currentProductError } =
    useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isValidProduct, setIsValidProduct] = useState(null); // null = loading, true = valid, false = invalid

  // Проверяем, является ли ID валидным числом (только цифры, больше 0)
  if (!id || !/^\d+$/.test(id) || Number(id) < 1) {
    return <Navigate to="/404" replace />;
  }

  useEffect(() => {
    const checkProductExists = async () => {
      try {
        const response = await fetch(`${API_URL}/products/all`);
        if (!response.ok) {
          setIsValidProduct(false);
          return;
        }
        const products = await response.json();
        const productExists = products.some(product => product.id === Number(id));
        setIsValidProduct(productExists);
      } catch (error) {
        setIsValidProduct(false);
      }
    };

    checkProductExists();
  }, [id]);

  useEffect(() => {
    if (id && isValidProduct === true) {
      dispatch(fetchProductById(id));
    }
  }, [id, dispatch, isValidProduct]);

  // Показываем загрузку пока проверяем существование продукта
  if (isValidProduct === null) {
    return <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'Montserrat' }}>Loading...</div>;
  }

  // Если продукт не существует, перенаправляем на 404
  if (isValidProduct === false) {
    return <Navigate to="/404" replace />;
  }

  const handleQuantityChange = (change) => {
    const newQ = quantity + change;
    if (newQ >= 1) setQuantity(newQ);
  };
  const handleAddToCart = () => {
    if (currentProduct) {
      dispatch(
        addToBasket({
          id: currentProduct.id,
          title: currentProduct.title,
          price: currentProduct.price,
          discont_price: currentProduct.discont_price,
          image: currentProduct.image,
          quantity,
        })
      );
      setQuantity(1);
    }
  };
  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  if (currentProductLoading)
    return (
      <div className={styles.container}>
        <Typography>Загрузка...</Typography>
      </div>
    );
  if (currentProductError || !currentProduct)
    return (
      <div className={styles.container}>
        <Typography>Продукт не найден</Typography>
        {currentProductError && (
          <Typography>Ошибка: {currentProductError}</Typography>
        )}
      </div>
    );

  const product = currentProduct;
  const hasDiscount =
    product.discont_price && product.discont_price !== product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discont_price) / product.price) * 100
      )
    : 0;
  const breadcrumbs = getBreadcrumbs(product);
  const shouldTruncate = (product.description || "").length > 650;
  const displayDescription = getDesc(product.description, showFullDescription);

  return (
    <div className={styles.container}>
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

      <div className={styles.productContent}>
        <div className={styles.imageContainer}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className={styles.productImage}
              onError={(e) => {
                e.target.style.display = "none";
              }}
              onLoad={() => {}}
            />
          ) : (
            <div style={STYLES.placeholder}>No image available</div>
          )}
        </div>

        <div className={styles.productInfo}>
          <Typography className={styles.productTitle} sx={STYLES.title}>
            {product.title}
          </Typography>

          <div className={styles.priceSection}>
            <div className={styles.priceContainer}>
              <Typography className={styles.currentPrice} sx={STYLES.price}>
                ${product.discont_price || product.price}
              </Typography>

              {hasDiscount && (
                <>
                  <Typography
                    variant="body1"
                    className={styles.oldPrice}
                    sx={STYLES.oldPrice}
                  >
                    ${product.price}
                  </Typography>
                  <div className={styles.discountBadge}>
                    <Typography variant="body2" sx={STYLES.discount}>
                      -{discountPercent}%
                    </Typography>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.quantitySection}>
            <div className={styles.quantityContainer}>
              <div className={styles.quantityControls}>
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className={styles.quantityButton}
                >
                  <img
                    src={minusIcon}
                    alt="minus"
                    className={styles.quantityIcon}
                  />
                </button>

                <Typography variant="body1" className={styles.quantityValue}>
                  {quantity}
                </Typography>

                <button
                  onClick={() => handleQuantityChange(1)}
                  className={styles.quantityButton}
                >
                  <img
                    src={plusIcon}
                    alt="plus"
                    className={styles.quantityIcon}
                  />
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              variant="contained"
              className={styles.addToCartButton}
              sx={STYLES.addToCart}
            >
              Add to cart
            </Button>
          </div>

          <div className={styles.descriptionSection}>
            <Typography
              className={styles.descriptionTitle}
              sx={STYLES.descTitle}
            >
              Description
            </Typography>
            <Typography className={styles.descriptionText} sx={STYLES.descText}>
              {displayDescription}
            </Typography>
            {shouldTruncate && (
              <Button
                onClick={toggleDescription}
                className={styles.readMoreButton}
                sx={STYLES.readMore}
              >
                {showFullDescription ? "Read less" : "Read more"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
