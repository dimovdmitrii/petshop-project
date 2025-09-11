import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProducts } from '../../redux/slices/productSlice';
import CartSales from '../cartSales';
import styles from './styles.module.css';

const MainPageSales = () => {
  const dispatch = useDispatch();
  const { allProducts, allProductsLoading, allProductsError } = useSelector(state => state.products);

  useEffect(() => {
    if (allProducts.length === 0) {
      dispatch(fetchAllProducts());
    }
  }, [dispatch, allProducts.length]);

  const salesProducts = allProducts
    .filter(product => product.price && product.discont_price && product.discont_price < product.price)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  if (allProductsLoading) {
    return (
      <section className={styles.salesSection}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading sales products...</div>
        </div>
      </section>
    );
  }

  if (allProductsError) {
    return (
      <section className={styles.salesSection}>
        <div className={styles.container}>
          <div className={styles.error}>Error: {allProductsError}</div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.salesSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Sale</h2>
          <Link to="/sales" className={styles.allSalesBtn}>
            All sales
          </Link>
        </div>

        <div className={styles.productsGrid}>
          {salesProducts.map((product) => (
            <CartSales key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MainPageSales;
