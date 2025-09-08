import ProductList from '../../components/productList';
import { API_URL } from '../../config/api';

const Products = () => {
  const breadcrumbs = [
    { text: 'Main page', link: '/' },
    { text: 'All products' }
  ];

  return (
    <ProductList
      title="All products"
      breadcrumbs={breadcrumbs}
      apiEndpoint={`${API_URL}/products/all`}
      showFilters={true}
    />
  );
};

export default Products;
