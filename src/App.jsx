import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Main from "./pages/main";
import Categories from "./pages/categories";
import Products from "./pages/products";
import Sales from "./pages/sales";
import Basket from "./pages/basket";

const App = () => {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/basket" element={<Basket />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
