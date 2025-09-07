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
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      
      state.count = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => {
        const price = item.discont_price || item.price;
        return total + (price * item.quantity);
      }, 0);
    },
    removeFromBasket: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      
      state.count = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => {
        const price = item.discont_price || item.price;
        return total + (price * item.quantity);
      }, 0);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        }
      }
      
      state.count = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => {
        const price = item.discont_price || item.price;
        return total + (price * item.quantity);
      }, 0);
    },
    clearBasket: (state) => {
      state.items = [];
      state.total = 0;
      state.count = 0;
    }
  }
});

export const { addToBasket, removeFromBasket, updateQuantity, clearBasket } = basketSlice.actions;
export default basketSlice.reducer;
