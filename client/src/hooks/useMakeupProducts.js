import { useState, useEffect } from 'react';
import axios from '../utils/axios';

/**
 * Custom hook to fetch products from Makeup API via backend
 */
export const useMakeupProducts = (category = null, options = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {};
        if (category) params.category = category;
        if (options.brand) params.brand = options.brand;
        if (options.sortBy) params.sortBy = options.sortBy;
        if (options.minPrice) params.minPrice = options.minPrice;
        if (options.maxPrice) params.maxPrice = options.maxPrice;
        if (options.rating) params.rating = options.rating;

        const { data } = await axios.get('/products', { params });
        setProducts(data.products || data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, options.brand, options.sortBy, options.minPrice, options.maxPrice, options.rating]);

  return { products, loading, error };
};

/**
 * Custom hook to search products
 */
export const useProductSearch = (searchTerm, filters = {}) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = { q: searchTerm, ...filters };
        const { data } = await axios.get('/products/search', { params });
        setResults(data.products || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Search failed');
        console.error('Error searching products:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, JSON.stringify(filters)]);

  return { results, loading, error };
};

/**
 * Function to sync products from Makeup API
 */
export const syncProductsFromAPI = async () => {
  try {
    const { data } = await axios.post('/products/sync');
    return data;
  } catch (error) {
    console.error('Error syncing products:', error);
    throw error;
  }
};

/**
 * Fetch products by category directly from Makeup API
 * This bypasses the backend and fetches directly
 */
export const fetchMakeupProductsDirect = async (brand = 'maybelline') => {
  try {
    const response = await fetch(
      `https://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from Makeup API:', error);
    return [];
  }
};

/**
 * Get all available brands from Makeup API
 */
export const getMakeupBrands = () => {
  return [
    'maybelline',
    'covergirl', 
    'nyx',
    'revlon',
    "l'oreal",
    'clinique',
    'dior',
    'glossier',
    "physicians formula",
    "burt's bees",
    'neutrogena',
    'garnier'
  ];
};
