import ProductList from '../../components/productList';

const Products = () => {
  const breadcrumbs = [
    { text: 'Main page', link: '/' },
    { text: 'All products' }
  ];

  return (
    <ProductList
      title="All products"
      breadcrumbs={breadcrumbs}
      apiEndpoint="http://localhost:3333/products/all"
      showFilters={true}
    />
  );
};

export default Products;
