import ProductList from '../../components/productList';
import { API_URL } from '../../config/api';

const Sales = () => {
  const breadcrumbs = [
    { text: 'Main page', link: '/' },
    { text: 'All sales' }
  ];

  return (
    <ProductList
      title="Discounted items"
      breadcrumbs={breadcrumbs}
      apiEndpoint={`${API_URL}/products/all`}
      showFilters={true}
      showDiscountFilter={false}
    />
  );
};

export default Sales;
