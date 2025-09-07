import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Асинхронные thunks для работы с продуктами
export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3333/products/all');
      const data = response.data;
      
      // Обрабатываем данные с API
      let productsData = [];
      if (Array.isArray(data)) {
        productsData = data;
      } else if (data.data && Array.isArray(data.data)) {
        productsData = data.data;
      } else if (data.products && Array.isArray(data.products)) {
        productsData = data.products;
      }
      
      return productsData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3333/categories/${categoryId}`);
      const data = response.data;
      
      // Обрабатываем данные с API
      let productsData = [];
      if (Array.isArray(data)) {
        productsData = data;
      } else if (data.data && Array.isArray(data.data)) {
        productsData = data.data;
      } else if (data.products && Array.isArray(data.products)) {
        productsData = data.products;
      }
      
      return productsData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3333/products/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    // Все продукты
    allProducts: [],
    allProductsLoading: false,
    allProductsError: null,
    
    // Продукты по категории
    categoryProducts: [],
    categoryProductsLoading: false,
    categoryProductsError: null,
    
    // Отдельный продукт
    currentProduct: null,
    currentProductLoading: false,
    currentProductError: null,
    
    // Фильтры и сортировка
    filters: {
      priceFrom: '',
      priceTo: '',
      discountedOnly: false,
      sortBy: 'default'
    },
    
    // Отфильтрованные продукты
    filteredProducts: []
  },
  reducers: {
    // Очистка ошибок
    clearAllProductsError: (state) => {
      state.allProductsError = null;
    },
    clearCategoryProductsError: (state) => {
      state.categoryProductsError = null;
    },
    clearCurrentProductError: (state) => {
      state.currentProductError = null;
    },
    
    // Управление фильтрами
    setPriceFrom: (state, action) => {
      state.filters.priceFrom = action.payload;
    },
    setPriceTo: (state, action) => {
      state.filters.priceTo = action.payload;
    },
    setDiscountedOnly: (state, action) => {
      state.filters.discountedOnly = action.payload;
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        priceFrom: '',
        priceTo: '',
        discountedOnly: false,
        sortBy: 'default'
      };
    },
    
    // Применение фильтров и сортировки
    applyFilters: (state) => {
      let products = [...state.allProducts];
      
      // Если есть продукты категории, используем их
      if (state.categoryProducts.length > 0) {
        products = [...state.categoryProducts];
      }
      
      // Применяем фильтры
      products = products.filter(product => {
        const currentPrice = product.discont_price || product.price;
        
        // Фильтр по цене
        if (state.filters.priceFrom && currentPrice < parseFloat(state.filters.priceFrom)) {
          return false;
        }
        if (state.filters.priceTo && currentPrice > parseFloat(state.filters.priceTo)) {
          return false;
        }
        
        // Фильтр по скидке
        if (state.filters.discountedOnly && (!product.discont_price || product.discont_price >= product.price)) {
          return false;
        }
        
        return true;
      });
      
      // Применяем сортировку
      if (state.filters.sortBy !== 'default') {
        products.sort((a, b) => {
          switch (state.filters.sortBy) {
            case 'newest':
              return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            case 'price-high-low':
              return (b.discont_price || b.price) - (a.discont_price || a.price);
            case 'price-low-high':
              return (a.discont_price || a.price) - (b.discont_price || b.price);
            default:
              return 0;
          }
        });
      }
      
      state.filteredProducts = products;
    },
    
    // Очистка данных
    clearAllProducts: (state) => {
      state.allProducts = [];
      state.filteredProducts = [];
    },
    clearCategoryProducts: (state) => {
      state.categoryProducts = [];
      state.filteredProducts = [];
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.allProductsLoading = true;
        state.allProductsError = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.allProductsLoading = false;
        state.allProducts = action.payload;
        // Автоматически применяем фильтры после загрузки
        productSlice.caseReducers.applyFilters(state);
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.allProductsLoading = false;
        state.allProductsError = action.payload;
      })
      
      // Fetch Products by Category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.categoryProductsLoading = true;
        state.categoryProductsError = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.categoryProductsLoading = false;
        state.categoryProducts = action.payload;
        // Автоматически применяем фильтры после загрузки
        productSlice.caseReducers.applyFilters(state);
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.categoryProductsLoading = false;
        state.categoryProductsError = action.payload;
      })
      
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.currentProductLoading = true;
        state.currentProductError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProductLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.currentProductLoading = false;
        state.currentProductError = action.payload;
      });
  }
});

export const {
  clearAllProductsError,
  clearCategoryProductsError,
  clearCurrentProductError,
  setPriceFrom,
  setPriceTo,
  setDiscountedOnly,
  setSortBy,
  resetFilters,
  applyFilters,
  clearAllProducts,
  clearCategoryProducts,
  clearCurrentProduct
} = productSlice.actions;

export default productSlice.reducer;
