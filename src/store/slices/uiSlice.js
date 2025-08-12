import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  search: '',
  showSearch: false,
  filters: {
    category: [],
    subCategory: [],
    sortType: 'relavent',
  },
  showFilter: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    
    setShowSearch: (state, action) => {
      state.showSearch = action.payload;
    },
    
    setShowFilter: (state, action) => {
      state.showFilter = action.payload;
    },
    
    toggleCategory: (state, action) => {
      const category = action.payload;
      const categoryIndex = state.filters.category.indexOf(category);
      
      if (categoryIndex > -1) {
        state.filters.category.splice(categoryIndex, 1);
      } else {
        state.filters.category.push(category);
      }
    },
    
    toggleSubCategory: (state, action) => {
      const subCategory = action.payload;
      const subCategoryIndex = state.filters.subCategory.indexOf(subCategory);
      
      if (subCategoryIndex > -1) {
        state.filters.subCategory.splice(subCategoryIndex, 1);
      } else {
        state.filters.subCategory.push(subCategory);
      }
    },
    
    setSortType: (state, action) => {
      state.filters.sortType = action.payload;
    },
    
    clearFilters: (state) => {
      state.filters.category = [];
      state.filters.subCategory = [];
      state.filters.sortType = 'relavent';
    },
  },
});

export const {
  setSearch,
  setShowSearch,
  setShowFilter,
  toggleCategory,
  toggleSubCategory,
  setSortType,
  clearFilters,
} = uiSlice.actions;

// Selectors
export const selectSearch = (state) => state.ui.search;
export const selectShowSearch = (state) => state.ui.showSearch;
export const selectShowFilter = (state) => state.ui.showFilter;
export const selectFilters = (state) => state.ui.filters;
export const selectSortType = (state) => state.ui.filters.sortType;

export default uiSlice.reducer;