import { useParams, Navigate } from 'react-router-dom';
import ProductList from '../productList';
import { API_URL } from '../../config/api';

const CategoryProducts = () => {
  const { id } = useParams();
  
  // Проверяем, является ли ID числом (валидные ID категорий)
  if (!id || isNaN(Number(id)) || Number(id) < 1) {
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