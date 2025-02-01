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
  
  function showComingSoonAlert() {
    Swal.fire({
        icon: 'info',
        title: 'Coming Soon!',
        text: 'The "Buy Now" feature will be available very soon. Stay tuned!',
        confirmButtonText: 'Got it!',
    });
}

  