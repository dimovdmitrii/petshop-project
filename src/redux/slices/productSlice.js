import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config/api';

// Утилиты
const parseProductsData = (data) => {
  if (Array.isArray(data)) return data;
  if (data.data && Array.isArray(data.data)) return data.data;
  if (data.products && Array.isArray(data.products)) return data.products;
  return [];
};

const parseCategoryData = (data) => {
  if (data.category) return data.category;
  if (Array.isArray(data) && data.length > 0) return data[0];
  if (data.title) return data;
  return null;
};

const parseProductData = (data) => {
  if (Array.isArray(data) && data.length > 0) return data[0];
  if (data && typeof data === 'object') return data;
  return null;
};

const hasDiscount = (product) => {
  return product.discont_price && product.discont_price !== null && product.discont_price < product.price;
};

const getCurrentPrice = (product) => product.discont_price || product.price;

const filterProducts = (products, filters, salesMode) => {
  return products.filter(product => {
    const currentPrice = getCurrentPrice(product);
    if (filters.priceFrom && currentPrice < parseFloat(filters.priceFrom)) return false;
    if (filters.priceTo && currentPrice > parseFloat(filters.priceTo)) return false;
    if (!salesMode && filters.discountedOnly && !hasDiscount(product)) return false;
    if (salesMode && !hasDiscount(product)) return false;
    return true;
  });
};

const sortProducts = (products, sortBy) => {
  if (sortBy === 'default') return products;
  return [...products].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'price-high-low': return getCurrentPrice(b) - getCurrentPrice(a);
      case 'price-low-high': return getCurrentPrice(a) - getCurrentPrice(b);
      default: return 0;
    }
  });
};

const applyFiltersAndSorting = (products, filters, salesMode) => {
  return sortProducts(filterProducts(products, filters, salesMode), filters.sortBy);
};

const getProductsForContext = (currentContext, allProducts, categoryProducts) => {
  if (currentContext === 'category' && categoryProducts.length > 0) return [...categoryProducts];
  if (currentContext === 'all' && allProducts.length > 0) return [...allProducts];
  return [];
};

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/all`);
      return parseProductsData(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/categories/${categoryId}`);
      return {
        products: parseProductsData(response.data),
        category: parseCategoryData(response.data)
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}`);
      const product = parseProductData(response.data);

      if (product?.categoryId) {
        try {
          const categoryResponse = await axios.get(`${API_URL}/categories/${product.categoryId}`);
          return { ...product, category: parseCategoryData(categoryResponse.data) };
        } catch (categoryError) {
          return product;
        }
      }
      
      return product;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    allProducts: [],
    allProductsLoading: false,
    allProductsError: null,
    
    categoryProducts: [],
    categoryProductsLoading: false,
    categoryProductsError: null,
    
    currentCategory: null,
    
    currentProduct: null,
    currentProductLoading: false,
    currentProductError: null,
    
    filters: {
      priceFrom: '',
      priceTo: '',
      discountedOnly: false,
      sortBy: 'default'
    },
    
    currentContext: 'all',
    
    salesMode: false,
    
    filteredProducts: []
  },
  reducers: {
    clearError: (state, action) => {
      const errorType = action.payload;
      if (errorType === 'allProducts') state.allProductsError = null;
      if (errorType === 'categoryProducts') state.categoryProductsError = null;
      if (errorType === 'currentProduct') state.currentProductError = null;
    },
    
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      if (key in state.filters) {
        state.filters[key] = value;
      }
    },
    
    setContext: (state, action) => {
      const { context, salesMode } = action.payload;
      state.currentContext = context;
      if (salesMode !== undefined) state.salesMode = salesMode;
    },
    
    resetFilters: (state) => {
      state.filters = { priceFrom: '', priceTo: '', discountedOnly: false, sortBy: 'default' };
    },
    
    applyFilters: (state) => {
      const products = getProductsForContext(state.currentContext, state.allProducts, state.categoryProducts);
      state.filteredProducts = applyFiltersAndSorting(products, state.filters, state.salesMode);
    },
    
    clearData: (state, action) => {
      const dataType = action.payload;
      if (dataType === 'allProducts') {
        state.allProducts = [];
        state.filteredProducts = [];
      } else if (dataType === 'categoryProducts') {
        state.categoryProducts = [];
        state.currentCategory = null;
        state.filteredProducts = [];
      } else if (dataType === 'currentProduct') {
        state.currentProduct = null;
      }
    }
  },
  extraReducers: (builder) => {
    const createAsyncReducer = (thunk, loadingKey, errorKey, dataKey, onFulfilled) => {
      builder
        .addCase(thunk.pending, (state) => {
          state[loadingKey] = true;
          state[errorKey] = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state[loadingKey] = false;
          if (dataKey) state[dataKey] = action.payload;
          if (onFulfilled) onFulfilled(state, action);
        })
        .addCase(thunk.rejected, (state, action) => {
          state[loadingKey] = false;
          state[errorKey] = action.payload;
        });
    };

    createAsyncReducer(fetchAllProducts, 'allProductsLoading', 'allProductsError', 'allProducts', 
      (state) => productSlice.caseReducers.applyFilters(state));
    
    createAsyncReducer(fetchProductsByCategory, 'categoryProductsLoading', 'categoryProductsError', null,
      (state, action) => {
        state.categoryProducts = action.payload.products;
        state.currentCategory = action.payload.category;
        productSlice.caseReducers.applyFilters(state);
      });
    
    createAsyncReducer(fetchProductById, 'currentProductLoading', 'currentProductError', 'currentProduct');
  }
});

export const {
  clearError,
  setFilter,
  setContext,
  resetFilters,
  applyFilters,
  clearData
} = productSlice.actions;

export default productSlice.reducer;
