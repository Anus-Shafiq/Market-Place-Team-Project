let productImage = document.getElementById("productImage");
let inputImage = document.getElementById("imageInput");

function getImg() {
  productImage.src = URL.createObjectURL(inputImage.files[0]);
}

inputImage.addEventListener("change", getImg);
