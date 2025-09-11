import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { API_URL } from "../../config/api";
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

const getBreadcrumbs = (product) => [
  { text: "Main page", link: "/" },
  { text: "Categories", link: "/categories" },
  ...(product?.category
    ? [
        {
          text: product.category.title || product.category.name || "Category",
          link: `/categories/${product.category.id || product.categoryId}`,
        },
      ]
    : []),
  {
    text: product?.title
      ? product.title.length > 25
        ? product.title.substring(0, 25).trim() + "..."
        : product.title
      : "Product",
  },
];

const getDesc = (d, show) =>
  !d ? "" : show || d.length <= 650 ? d : d.substring(0, 650).trim() + "...";

const CartPage = () => {
  const { id } = useParams();
  const [state, setState] = useState({
    product: null,
    loading: true,
    error: null,
  });
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setState({ product: null, loading: true, error: null });
      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setState({ product: data, loading: false, error: null });
      } catch (err) {
        setState({ product: null, loading: false, error: err.message });
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (change) => {
    const newQ = quantity + change;
    if (newQ >= 1) setQuantity(newQ);
  };

  const handleAddToCart = () => {
    // можно сюда подключить Redux или localStorage
    console.log("Add to cart:", state.product, quantity);
    setQuantity(1);
  };

  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  if (state.loading)
    return (
      <div className={styles.container}>
        <Typography>Loading...</Typography>
      </div>
    );

  if (state.error || !state.product)
    return (
      <div className={styles.container}>
        <Typography>Product not found</Typography>
        {state.error && <Typography>Error: {state.error}</Typography>}
      </div>
    );

  const product = state.product;
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
              src={
                product.image.startsWith("http")
                  ? product.image
                  : `${API_URL}${product.image}`
              }
              alt={product.title}
              className={styles.productImage}
              onError={(e) => {
                e.target.style.display = "none";
              }}
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
                  -
                </button>
                <Typography variant="body1" className={styles.quantityValue}>
                  {quantity}
                </Typography>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className={styles.quantityButton}
                >
                  +
                </button>
              </div>
            </div>
            <Button
              onClick={handleAddToCart}
              variant="contained"
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
              <Button onClick={toggleDescription} sx={STYLES.readMore}>
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
