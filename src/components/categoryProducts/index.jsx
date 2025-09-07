import { useParams } from 'react-router-dom';
import ProductList from '../productList';

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
      apiEndpoint={`http://localhost:3333/categories/${id}`}
      showFilters={true}
    />
  );
};

export default CategoryProducts;