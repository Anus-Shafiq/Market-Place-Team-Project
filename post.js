let productTitle = document.getElementById("productTitle");
let productPrice = document.getElementById("productPrice");
let productDescription = document.getElementById("productDescription");
let productFile = document.querySelector(".productFile");
let postButton = document.getElementById("postBtn");
let productList = document.getElementById("productList");

// *********************** Add Post in Table *********************

async function addPostToDB() {
  const titleRegex = /^[A-Za-z\s]{3,}$/;
  if (!titleRegex.test(productTitle.value)) {
    Swal.fire({
      title: "Please enter a valid title (At least 3 characters).",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }

  const priceRegex = /^[1-9]\d*(\.\d+)?$/;
  if (!priceRegex.test(productPrice.value)) {
    Swal.fire({
      title: "Please enter a valid price (Must be greater than 0).",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }

  const descriptionRegex = /^.{10,}$/;
  if (!descriptionRegex.test(productDescription.value)) {
    Swal.fire({
      title: "Description must be at least 10 characters long.",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }

  if (productFile.files.length === 0) {
    Swal.fire({
      title: "Please upload an image.",
      icon: "info",
      confirmButtonText: "OK",
    });
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
        updated_at: new Date().toISOString(),
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

// ****** UPLOAD PRODUCT IMAGE | GET URL FROM BUCKET & UPDATE IN DATABASE ******

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

    let { data: imageData } = supabase.storage
      .from("studentImages")
      .getPublicUrl(`products/${productId}_${file.name}`);

    if (imageData) {
      console.log("Image URL:", imageData.publicUrl);

      //******************** */ Update Url in Database Table*****************

      const { error: updateError } = await supabase
        .from("Product")
        .update({ imageUrl: imageData.publicUrl })
        .eq("id", productId);

      if (updateError) throw updateError;
      Swal.fire({
        title: "Product added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

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
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*");
    console.log(userData);
    if (error) throw error;
    if (userError) throw userError;

    let productList = document.getElementById("productList");
    productList.innerHTML = "";

    data.reverse().forEach((product) => {
      const user = userData.find((u) => u.userId === product.userId);
      console.log(user);

      const username = user ? user.name : "Anonymouse";

      productList.innerHTML += `
<div class="col-lg-3 col-md-4 col-sm-6 mb-4" data-aos="flip-left">
    <div class="card h-100 shadow-sm rounded-3 overflow-hidden position-relative rounded-4 ">

        <div class="card-body pt-2 px-3">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <div>
                        <strong class='text-primary '>${username}</strong>
                        <br>
                        <small class="text-muted text-primary">
                           <i class="fa fa-history text-primary"></i>
                            ${(() => {
                              let diff = Math.floor(
                                (new Date() - new Date(product.created_at)) /
                                  3600000
                              );
                              if (diff < 24) return diff + " hr ago";
                              diff = Math.floor(diff / 24);
                              if (diff < 30) return diff + " days ago";
                              return Math.floor(diff / 30) + " months ago";
                            })()}
                        </small>
                    </div>
                </div>
                <div class="card-body">
                  <h5 class="card-title">${product.title}</h5>
                  <p class="card-text">${product.description}</p>
                  <div class="d-flex justify-content-between">
                    <button class="btn btn-danger w-75" onclick="deleteProduct(${
                      product.id
                    })">Delete</button>
                    <button class="btn btn-light" onclick="toggleFavorite(${
                      product.id
                    })">
                      <i id="fav-icon-${
                        product.id
                      }" class="fa fa-heart text-secondary"></i>
                    </button>
                    <ul class="dropdown-menu">
                        ${
                          product.userId === currentUser.id
                            ? `<li><a class="dropdown-item text-primary" href="#" onclick="deleteMyPost('${product.id}')">Delete</a></li>`
                            : ""
                        }
                    </ul>
                </div>
            </div>
        </div>    
    
        <div class="position-relative px-2">
            <img src="${
              product.imageUrl
            }" class="card-img-top rounded-3 " alt="${
        product.title
      }" style="object-fit: cover; height: 180px;">
            <span class="price-tag position-absolute top-0 end-0 bg-primary text-info px-3 mx-2 py-2 rounded-bottom">
                ${product.price} Pkr
            </span>
        </div>

        <div class="card-body px-3">
            <h5 class="card-title text-truncate text-primary" >
                ${product.title}
            </h5>
            <p class="card-text text-muted text-truncate" style="max-height: 50px; overflow: hidden;">
                ${product.description}
            </p>
        </div>

        <div class="card-footer d-flex justify-content-between align-items-center p-2">
            <!-- Heart Icon (Left) -->
            <button class="btn btn-light btn-sm" onclick="toggleFavorite('${
              product.postId
            }')">
                <i class="fa fa-heart text-secondary"></i>
            </button>

            <button class="btn btn-primary btn-sm px-4 ms-auto" onclick="showComingSoonAlert()">
              <i class="fa fa-cart-plus me-2 text-info"></i> Buy Now
            </button>
        </div>
    </div>
</div>

      `;
    });
  } catch (error) {
    console.error(error.message);
  }
}

postButton.addEventListener("click", addPostToDB);
window.onload = fetchProducts;

// *****************DELETE PEODUCT FROM DATABASE*********************

async function deleteMyPost(postId) {
  try {
    const userId = currentUser.id;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });
    if (result.isConfirmed) {
      const { data, error } = await supabase
        .from("Product")
        .delete()
        .eq("id", postId)
        .eq("userId", userId)
        .select();

      if (error) throw error;

      if (data.length > 0) {
        fetchProducts();
        Swal.fire({
          title: "Deleted!",
          text: "Your post has been deleted.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        console.log("post not found to delete.");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

window.deleteMyPost = deleteMyPost;

// ***************** FAVORITE ADD / DEL IN DATABASE*********************

//*********************/ Toggle favorite Checking*****************

window.toggleFavorite = async function (postId) {
  const userId = currentUser.id;

  const { data, error } = await supabase
    .from("Favorite")
    .select("id")
    .eq("userId", userId)
    .eq("postId", postId);

  if (error) {
    console.error("Error toggling favorite:", error.message);
    return;
  }

  if (data.length === 0) {
    console.log("Adding favorite...");
    await addFavorite(postId, userId);
  } else {
    console.log("Removing favorite...");
    await removeFavorite(postId, userId);
  }
};
//*********************/ Add post to favorites*****************

async function addFavorite(postId, userId) {
  try {
    const { error } = await supabase.from("Favorite").insert([
      {
        postId: postId,
        userId: userId,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    const icon = document.querySelector(`i[data-post-id="${postId}"]`);
    if (icon) {
      icon.classList.remove("text-secondary");
      icon.classList.add("text-danger");
    }

    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "success",
      title: "Favorite Added!",
      text: "Post Successfully added from your favorites.",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  } catch (error) {
    console.error(error.message);
  }
}
//*********************/ Remove post from favorites*****************

async function removeFavorite(postId, userId) {
  try {
    const { data, error } = await supabase
      .from("Favorite")
      .delete()
      .eq("postId", postId)
      .eq("userId", userId);

    if (error) throw error;

    console.log("Favorite removed:", data);

    const icon = document.querySelector(`i[data-post-id="${postId}"]`);
    if (icon) {
      icon.classList.remove("text-danger");
      icon.classList.add("text-secondary");
    }

    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "error",
      title: "Favorite Removed!",
      text: "Post removed from your favorites.",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  } catch (error) {
    console.error("Error removing favorite:", error.message);
  }
}
// ***************** FETCH POST ID IN FAVORITE*********************

document.addEventListener("DOMContentLoaded", async function () {
  const userId = currentUser?.id;
  if (!userId) return;

  try {
    const { data, error } = await supabase
      .from("Favorite")
      .select("postId")
      .eq("userId", userId);

    if (error) throw error;

    if (data && data.length > 0) {
      const favoriteCount = data.length;
      document.getElementById("favoriteCount").innerText = favoriteCount;

      for (const favorite of data) {
        const postId = favorite.postId;
        fetchPostDetails(postId);
      }
    } else {
      console.log("No favorite posts found.");
    }
  } catch (err) {
    console.error(err.message);
  }
});

// ***************** FETCH POST DETAILS IN PRODUCT *********************

async function fetchPostDetails(postId) {
  try {
    const { data, error } = await supabase
      .from("Product")
      .select("title, description, imageUrl")
      .eq("postId", postId)
      .single();

    if (error) throw error;

    if (data) {
      showModal(data);
    } else {
      console.log("Post not found.");
    }
  } catch (err) {
    console.error(err.message);
  }
}

// ***************** DISPLAY POST DETAILS IN MODAL *********************

function showModal(post) {
  const modalContent = document.getElementById("modalContent");

  if (modalContent) {
    modalContent.innerHTML += `
 <div class="modal-item border shadow p-3 mb-5 rounded">
        <div class="row">
          <div class="col-md-4">
            <img src="${post.imageUrl}" alt="Post Image" class="img-fluid rounded-start" style="max-height: 300px;">
          </div>
          <div class="col-md-8">
            <div class="p-3">
              <h2>${post.title}</h2>
              <p>${post.description}</p>
            </div>
          </div>
        </div>
      </div>`;
  } else {
    console.log("Modal content not found.");
    return;
  }
}
