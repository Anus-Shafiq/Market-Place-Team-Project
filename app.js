function toggleFavorite(productId) {
    let favIcon = document.getElementById(`fav-icon-${productId}`);
    favIcon.classList.toggle("text-danger");
    favIcon.classList.toggle("text-secondary");
  }
  
  function previewImage(event) {
    const file = event.target.files[0]; 
    const reader = new FileReader();
  
    reader.onload = function(e) {
      const productImage = document.getElementById('productImage');
      productImage.src = e.target.result;  
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  }
  