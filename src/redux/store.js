
import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import basketReducer from "./slices/basketSlice";

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    basket: basketReducer,
  },
});
