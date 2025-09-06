axios
  .get("http://localhost:3333/categories/${ctegoryId}")
  .then((response) => {
    this.setState({ products: response.data });
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
  });
