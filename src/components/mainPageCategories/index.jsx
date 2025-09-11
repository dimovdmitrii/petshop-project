import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { fetchCategories } from '../../redux/slices/categorySlice';
import CategoryCard from '../cartCategories';
import { API_URL } from '../../config/api';
import styles from './styles.module.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SHOW_NAVIGATION_THRESHOLD = 4;
const SWIPER_BREAKPOINTS = {
  320: { slidesPerView: 1.7, spaceBetween: 4, centeredSlides: true },
  480: { slidesPerView: 2, spaceBetween: 20, centeredSlides: true },
  768: { slidesPerView: 3, spaceBetween: 24, centeredSlides: true },
  1024: { slidesPerView: 3, spaceBetween: 28, centeredSlides: false },
  1440: { slidesPerView: 4, spaceBetween: 32, centeredSlides: false },
};

const MainPageCategories = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const showNavigation = Array.isArray(categories) && categories.length > SHOW_NAVIGATION_THRESHOLD;

  const renderHeader = () => (
    <div className={styles.header}>
      <h2 className={styles.title}>Categories</h2>
      <Link to="/categories" className={styles.allCategoriesBtn}>All categories</Link>
    </div>
  );

  const getSwiperConfig = () => ({
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: 32,
    slidesPerView: "auto",
    navigation: showNavigation ? { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' } : false,
    pagination: showNavigation ? { clickable: true, el: '.swiper-pagination' } : false,
    autoplay: showNavigation ? { delay: 3000, disableOnInteraction: false } : false,
    loop: showNavigation,
    breakpoints: SWIPER_BREAKPOINTS,
    className: styles.swiper,
  });

  const renderNavigation = () => showNavigation && (
    <>
      <div className={`swiper-button-prev ${styles.navButton}`}></div>
      <div className={`swiper-button-next ${styles.navButton}`}></div>
      <div className={`swiper-pagination ${styles.pagination}`}></div>
    </>
  );

  if (loading) return (
    <section className={styles.categoriesSection}>
      <div className={styles.container}>
        {renderHeader()}
        <div className={styles.loading}>Loading categories...</div>
      </div>
    </section>
  );

  if (error) return (
    <section className={styles.categoriesSection}>
      <div className={styles.container}>
        {renderHeader()}
        <div className={styles.error}>Error loading categories: {error}</div>
      </div>
    </section>
  );

  if (!Array.isArray(categories) || categories.length === 0) {
    return (
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          {renderHeader()}
          <div className={styles.empty}>No categories found</div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.categoriesSection}>
      <div className={styles.container}>
        {renderHeader()}
        <div className={styles.swiperContainer}>
          <Swiper {...getSwiperConfig()}>
            {categories.map((category) => (
              <SwiperSlide key={category.id} className={styles.swiperSlide}>
                <CategoryCard category={category} />
              </SwiperSlide>
            ))}
          </Swiper>
          {renderNavigation()}
        </div>
      </div>
    </section>
  );
};

export default MainPageCategories;
