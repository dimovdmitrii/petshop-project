import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Main from "./pages/main";
import Categories from "./pages/categories";
import CategoryProducts from "./pages/categoryProducts";
import Products from "./pages/products";
import Sales from "./pages/sales";
import Basket from "./pages/basket";

const App = () => {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:id" element={<CategoryProducts />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/basket" element={<Basket />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
