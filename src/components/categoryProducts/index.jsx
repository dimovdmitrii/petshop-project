import { useParams } from 'react-router-dom';
import ProductList from '../productList';
import { API_URL } from '../../config/api';

const CategoryProducts = () => {
  const { id } = useParams();
  
  const breadcrumbs = [
    { text: 'Main page', link: '/' },
    { text: 'Categories', link: '/categories' },
    { text: 'Category' } // Название будет получено из API
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