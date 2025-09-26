import { useParams, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductList from '../productList';
import { API_URL } from '../../config/api';

const CategoryProducts = () => {
  const { id } = useParams();
  const [isValidCategory, setIsValidCategory] = useState(null); // null = loading, true = valid, false = invalid
  
  // Проверяем, является ли ID валидным числом (только цифры, больше 0)
  if (!id || !/^\d+$/.test(id) || Number(id) < 1) {
    return <Navigate to="/404" replace />;
  }

  useEffect(() => {
    const checkCategoryExists = async () => {
      try {
        const response = await fetch(`${API_URL}/categories/all`);
        if (!response.ok) {
          setIsValidCategory(false);
          return;
        }
        const categories = await response.json();
        const categoryExists = categories.some(category => category.id === Number(id));
        setIsValidCategory(categoryExists);
      } catch (error) {
        setIsValidCategory(false);
      }
    };

    checkCategoryExists();
  }, [id]);

  // Показываем загрузку пока проверяем
  if (isValidCategory === null) {
    return <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'Montserrat' }}>Loading...</div>;
  }

  // Если категория не существует, перенаправляем на 404
  if (isValidCategory === false) {
    return <Navigate to="/404" replace />;
  }
  
  const breadcrumbs = [
    { text: 'Main page', link: '/' },
    { text: 'Categories', link: '/categories' },
    { text: 'Category' }
  ];

  return (
    <ProductList
      title="Category Products"
      breadcrumbs={breadcrumbs}
      apiEndpoint={`${API_URL}/categories/${id}`}
      showFilters={true}
      dynamicTitle={true}
      dynamicBreadcrumbs={true}
    />
  );
};

export default CategoryProducts;