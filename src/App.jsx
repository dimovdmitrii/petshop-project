import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import ScrollToTop from "./components/ScrollToTop";
import Main from "./pages/main";
import Categories from "./pages/categories";
import CategoryProducts from "./components/categoryProducts";
import Products from "./pages/products";
import Sales from "./pages/sales";
import Basket from "./pages/basket";
import CartPage from "./components/cartPage";
import NotFounPage from "./pages/notFounPage";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:id" element={<CategoryProducts />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<CartPage />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="*" element={<NotFounPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
