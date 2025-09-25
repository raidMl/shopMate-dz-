// Favorites Management
function toggleFavorite(id) {
  const index = state.favorites.indexOf(id);
  if (index > -1) {
    state.favorites.splice(index, 1);
    toast('Removed from favorites', 'info');
  } else {
    state.favorites.push(id);
    toast('Added to favorites', 'success');
  }
  saveFavorites();
  updateFavoritesCount();
  renderProducts();
}

function saveFavorites() {
  saveToLocalStorage('favorites', state.favorites);
}

function updateFavoritesCount() {
  $('#favoritesCount').textContent = state.favorites.length;
}

// Initialize favorites
function initFavorites() {
  updateFavoritesCount();
}
