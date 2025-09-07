
import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import basketReducer from "./slices/basketSlice";
import productReducer from "./slices/productSlice";

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    basket: basketReducer,
    products: productReducer,
  },
});
