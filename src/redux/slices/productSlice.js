import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config/api';

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/all`);
      const data = response.data;
      
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
      const response = await axios.get(`${API_URL}/categories/${categoryId}`);
      const data = response.data;
      
      let productsData = [];
      let categoryData = null;
      
      if (Array.isArray(data)) {
        productsData = data;
      } else if (data.data && Array.isArray(data.data)) {
        productsData = data.data;
        categoryData = data.category || null;
      } else if (data.products && Array.isArray(data.products)) {
        productsData = data.products;
        categoryData = data.category || null;
      }
      
      return {
        products: productsData,
        category: categoryData
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
      const data = response.data;
      
      let product = null;
      if (Array.isArray(data) && data.length > 0) {
        product = data[0];
      } else {
        product = data;
      }

      if (product && product.categoryId) {
        try {
          const categoryResponse = await axios.get(`${API_URL}/categories/${product.categoryId}`);
          const categoryData = categoryResponse.data;
          
          let category = null;
          if (categoryData && categoryData.category) {
            category = categoryData.category;
          } else if (Array.isArray(categoryData) && categoryData.length > 0) {
            category = categoryData[0];
          } else if (categoryData && categoryData.title) {
            category = categoryData;
          }
          
          return {
            ...product,
            category: category
          };
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
    clearAllProductsError: (state) => {
      state.allProductsError = null;
    },
    clearCategoryProductsError: (state) => {
      state.categoryProductsError = null;
    },
    clearCurrentProductError: (state) => {
      state.currentProductError = null;
    },
    
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
    setCurrentContext: (state, action) => {
      state.currentContext = action.payload;
    },
    setSalesMode: (state, action) => {
      state.salesMode = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        priceFrom: '',
        priceTo: '',
        discountedOnly: false,
        sortBy: 'default'
      };
    },
    
    applyFilters: (state) => {
      let products = [];
      
      if (state.currentContext === 'category' && state.categoryProducts.length > 0) {
        products = [...state.categoryProducts];
      } else if (state.currentContext === 'all' && state.allProducts.length > 0) {
        products = [...state.allProducts];
      }
      
      products = products.filter(product => {
        const currentPrice = product.discont_price || product.price;
        
        if (state.filters.priceFrom && currentPrice < parseFloat(state.filters.priceFrom)) {
          return false;
        }
        if (state.filters.priceTo && currentPrice > parseFloat(state.filters.priceTo)) {
          return false;
        }
        
        if (!state.salesMode && state.filters.discountedOnly && (!product.discont_price || product.discont_price >= product.price)) {
          return false;
        }
        
        if (state.salesMode && (!product.discont_price || product.discont_price >= product.price)) {
          return false;
        }
        
        return true;
      });
      
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
    
    clearAllProducts: (state) => {
      state.allProducts = [];
      state.filteredProducts = [];
    },
    clearCategoryProducts: (state) => {
      state.categoryProducts = [];
      state.currentCategory = null;
      state.filteredProducts = [];
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.allProductsLoading = true;
        state.allProductsError = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.allProductsLoading = false;
        state.allProducts = action.payload;
        productSlice.caseReducers.applyFilters(state);
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.allProductsLoading = false;
        state.allProductsError = action.payload;
      })
      
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.categoryProductsLoading = true;
        state.categoryProductsError = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.categoryProductsLoading = false;
        state.categoryProducts = action.payload.products;
        state.currentCategory = action.payload.category;
        productSlice.caseReducers.applyFilters(state);
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.categoryProductsLoading = false;
        state.categoryProductsError = action.payload;
      })
      
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
  setCurrentContext,
  setSalesMode,
  resetFilters,
  applyFilters,
  clearAllProducts,
  clearCategoryProducts,
  clearCurrentProduct
} = productSlice.actions;

export default productSlice.reducer;
