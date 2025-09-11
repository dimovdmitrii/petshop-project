import { createSlice } from '@reduxjs/toolkit';

const basketSlice = createSlice({
  name: 'basket',
  initialState: {
    items: [],
    total: 0,
    count: 0
  },
  reducers: {
    addToBasket: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += product.quantity;
      } else {
        state.items.push({ ...product });
      }
      state.count = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => sum + ((item.discont_price || item.price) * item.quantity), 0);
    },
    removeFromBasket: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.count = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => sum + ((item.discont_price || item.price) * item.quantity), 0);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      state.count = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => sum + ((item.discont_price || item.price) * item.quantity), 0);
    },
    clearBasket: (state) => {
      state.items = [];
      state.total = 0;
      state.count = 0;
    }
  }
});

export const { addToBasket, removeFromBasket, updateQuantity, clearBasket } = basketSlice.actions;

export const selectBasketItems = (state) => state.basket.items;
export const selectBasketTotal = (state) => state.basket.total;
export const selectBasketCount = (state) => state.basket.count;

export default basketSlice.reducer;
