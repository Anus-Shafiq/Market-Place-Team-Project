function toggleFavorite(productId) {
    let favIcon = document.getElementById(`fav-icon-${productId}`);
    favIcon.classList.toggle("text-danger");
    favIcon.classList.toggle("text-secondary");
  }
  
