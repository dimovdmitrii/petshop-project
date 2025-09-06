import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './styles.module.css';

const CategoryProducts = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3333/categories/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('API Response:', data); // Для отладки
        
        // Проверяем, что data является массивом
        if (Array.isArray(data)) {
          setProducts(data);
          
          // Получаем название категории из первого продукта
          if (data.length > 0 && data[0].category) {
            setCategoryName(data[0].category.title || data[0].category.name);
          }
        } else {
          // Если data не массив, возможно это объект с массивом products
          if (data.products && Array.isArray(data.products)) {
            setProducts(data.products);
            if (data.products.length > 0 && data.products[0].category) {
              setCategoryName(data.products[0].category.title || data.products[0].category.name);
            }
          } else if (data.title || data.name) {
            // Если это объект категории, устанавливаем название
            setCategoryName(data.title || data.name);
            setProducts([]); // Пустой массив, если нет продуктов
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        setError(err.message);
        setProducts([]); // Устанавливаем пустой массив при ошибке
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProducts();
    }
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error}</div>
        <Link to="/" className={styles.backLink}>Back to Home</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/" className={styles.backLink}>← Back to Categories</Link>
        <h1 className={styles.title}>
          {categoryName ? `${categoryName} Products` : 'Category Products'}
        </h1>
      </div>

      {!Array.isArray(products) || products.length === 0 ? (
        <div className={styles.noProducts}>
          <p>No products found in this category.</p>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImage}>
                <img 
                  src={`http://localhost:3333${product.image}`} 
                  alt={product.title}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.png';
                  }}
                />
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>{product.title}</h3>
                <p className={styles.productPrice}>${product.price}</p>
                <p className={styles.productDescription}>
                  {product.description || 'No description available'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
