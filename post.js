let productTitle = document.getElementById('productTitle');
let productPrice = document.getElementById('productPrice');
let productDescription = document.getElementById("productDescription");
let productFile = document.querySelector(".productFile");
let postButton = document.getElementById("postBtn");
let productList = document.getElementById("productList");


// *********************** Add Post in Table *********************

async function addPostToDB() {
  if (productFile.files.length === 0) {
    alert("Please upload an image.");
    return;
  }

  try {
    const { data, error } = await supabase
      .from("Product")
      .insert({
        price: productPrice.value,
        title: productTitle.value,
        description: productDescription.value,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
      console.log("Insert response:", data, error);
    if (error) throw error;

    console.log("Post added:", data);

    await uploadProductImage(data[0].id);

  } catch (error) {
    console.error("Error adding post:", error.message);
    alert("Error while adding product: " + error.message);
  }
}

// ******** Upload Product image | Get Url from Bucket & update in Database  ******

async function uploadProductImage(productId) {
  let file = productFile.files[0];

  try {

    //*********************/ Upload image in Bucket *****************

    const { data, error } = await supabase.storage
      .from("studentImages") 
      .upload(`products/${productId}_${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    console.log("Image uploaded successfully:", data);

    //*********************/ Get Public Url from bucket*****************

    let { data: imageData } = supabase
      .storage
      .from("studentImages")
      .getPublicUrl(`products/${productId}_${file.name}`);

    if (imageData) {
      console.log("Image URL:", imageData.publicUrl);

      //******************** */ Update Url in Database Table*****************
      
      const { error: updateError } = await supabase
        .from("Product")
        .update({ imageUrl: imageData.publicUrl })
        .eq('id', productId);

      if (updateError) throw updateError;

      alert("Product added successfully with image!");
      resetForm();
    }
  } catch (error) {
    console.error("error  uploading image:", error.message);
  }
}

function resetForm() {
  productTitle.value = "";
  productPrice.value = "";
  productDescription.value = "";
  productFile.value = "";
}

    // *****************Fetch Product From Database*********************8*

    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from("Product").select("*");
        if (error) throw error;
    
        let productList = document.getElementById("productList");
        productList.innerHTML = "";
    
        // Loop through the products once
        data.reverse().forEach(product => {
          productList.innerHTML += `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div class="card h-100 shadow">
                <div class="position-relative">
                  <img src="${product.imageUrl}" class="card-img-top" alt="${product.title}">
                  <span class="price-tag position-absolute top-0 end-0 bg-white text-black px-2 py-1 rounded-start">
                    ${product.price} Pkr
                  </span>
                </div>
                <div class="card-body">
                  <h5 class="card-title">${product.title}</h5>
                  <p class="card-text">${product.description}</p>
                  <div class="d-flex justify-content-between">
                    <button class="btn btn-danger w-75" onclick="deleteProduct(${product.id})">Delete</button>
                    <button class="btn btn-light" onclick="toggleFavorite(${product.id})">
                      <i id="fav-icon-${product.id}" class="fa fa-heart text-secondary"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
    
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    }
    
 
postButton.addEventListener("click", addPostToDB);
window.onload = fetchProducts;
