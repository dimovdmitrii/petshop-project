import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { fetchCategories } from '../../redux/slices/categorySlice';
import CategoryCard from '../cartCategories';
import styles from './styles.module.css';

// Импорт стилей Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const MainPageCategories = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return (
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Categories</h2>
            <Link to="/categories" className={styles.allCategoriesBtn}>
              All categories
            </Link>
          </div>
          <div className={styles.loading}>Loading categories...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Categories</h2>
            <Link to="/categories" className={styles.allCategoriesBtn}>
              All categories
            </Link>
          </div>
          <div className={styles.error}>Error loading categories: {error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.categoriesSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Categories</h2>
          <Link to="/categories" className={styles.allCategoriesBtn}>
            All categories
          </Link>
        </div>
        
        <div className={styles.swiperContainer}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={32}
            slidesPerView="auto"
            navigation={categories.length > 4 ? {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            } : false}
            pagination={categories.length > 4 ? {
              clickable: true,
              el: '.swiper-pagination',
            } : false}
            autoplay={categories.length > 4 ? {
              delay: 3000,
              disableOnInteraction: false,
            } : false} // Автопрокрутка только если категорий больше 4
            loop={categories.length > 4} // Включаем loop только если категорий больше 4
            breakpoints={{
              320: {
                slidesPerView: 1.7,
                spaceBetween: 4,
                centeredSlides: true,
              },
              480: {
                slidesPerView: 2,
                spaceBetween: 20,
                centeredSlides: true,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 24,
                centeredSlides: true,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 28,
                centeredSlides: false,
              },
              1440: {
                slidesPerView: 4,
                spaceBetween: 32,
                centeredSlides: false,
              },
            }}
            className={styles.swiper}
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id} className={styles.swiperSlide}>
                <CategoryCard category={category} />
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Кастомные кнопки навигации - показываем только если категорий больше 4 */}
          {categories.length > 4 && (
            <>
              <div className={`swiper-button-prev ${styles.navButton}`}></div>
              <div className={`swiper-button-next ${styles.navButton}`}></div>
            </>
          )}
          
          {/* Пагинация - показываем только если категорий больше 4 */}
          {categories.length > 4 && (
            <div className={`swiper-pagination ${styles.pagination}`}></div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MainPageCategories;