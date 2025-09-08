import { Link } from 'react-router-dom';
import { API_URL } from '../../config/api';
import styles from './styles.module.css';

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/categories/${category.id}`} className={styles.categoryCard}>
      <div className={styles.imageContainer}>
        <img 
          src={`${API_URL}${category.image}`} 
          alt={category.title} 
          className={styles.categoryImage}
        />
      </div>
      <h3 className={styles.categoryTitle}>{category.title}</h3>
    </Link>
  );
};

export default CategoryCard;