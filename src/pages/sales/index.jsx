import ProductList from '../../components/productList';

const Sales = () => {
  const breadcrumbs = [
    { text: 'Main page', link: '/' },
    { text: 'All sales' }
  ];

  return (
    <ProductList
      title="Discounted items"
      breadcrumbs={breadcrumbs}
      apiEndpoint="http://localhost:3333/products/all"
      showFilters={true}
      showDiscountFilter={false}
    />
  );
};

export default Sales;
