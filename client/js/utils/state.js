// Application State Management
const state = {
  query: '',
  category: 'all',
  onlyStock: 'all',
  showFavorites: 'all',
  maxPrice: 90000,
  sort: 'popular',
  cart: JSON.parse(localStorage.getItem('cart') || '{}'), // {id: qty}
  cartVariants: JSON.parse(localStorage.getItem('cartVariants') || '{}'), // {key: {baseId, color, size}}
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'), // [id]
  isLoading: false
};

// State update functions
function updateState(key, value) {
  state[key] = value;
}

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
}
