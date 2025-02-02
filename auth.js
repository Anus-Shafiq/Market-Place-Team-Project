let SignupEmail = document.getElementById('signup-email')
let SignupPass = document.getElementById('signup-password')
let Signupbtn = document.getElementById('signup-btn')
let SigninEmail = document.getElementById('signin-email')
let SigninPass = document.getElementById('signin-password')
let Signinbtn = document.getElementById('signin-btn')
let signupBtnLoader = document.getElementById("loading_btn_spinner");
let SignupName = document.getElementById("signup_name");
let logoutBtn = document.getElementById("logout");

//************************* Sign Up ************************

async function signUp() {
    try {
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value.trim();
        
        // Email Validation
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Email',
            text: 'Please enter a valid email address.',
          });
          return;
        }
      
        // Password Validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (!passwordRegex.test(password)) {
          Swal.fire({
            icon: 'error',
            title: 'Weak Password',
            text: 'Password must be at least 8 characters long, and include at least 1 letter and 1 number',
          });
          return;
        }
      
        Swal.fire({
          icon: 'success',
          title: 'Verificaiton',
          text: 'Check Your Email and Verify your Account!',
        });

        const { data, error } = await supabase.auth.signUp({
            email: SignupEmail.value,
            password: SignupPass.value,
        })
        // console.log(data)
        if (error) throw error
        if (data) {
            Swal.fire({
                title: 'Please Check your email for confirmation',
                icon: 'info',
                confirmButtonText: 'OK'
            });
            try {
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .insert({
                        userId: data.user.id,
                        email: SignupEmail.value,
                        name: SignupName.value,
                    })
                    .select()
                if (userData) {
                    console.log(userData);

                }
                if (userError) throw userError;
            } catch (error) {
                console.log(error);
            }
            window.location.href = '/login.html'
        }
        return data
    } catch (error) {
        console.log(error)
    }
}
if (Signupbtn) {
    Signupbtn.addEventListener("click", signUp);
}

//************************* Sign In ************************

async function signIn() {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: SigninEmail.value,
            password: SigninPass.value,
        });
    
        if (error) throw error;
    
        if (data) {
            localStorage.setItem("currentUser", JSON.stringify(data.user));
            console.log("User logged in:", data.user);
            Swal.fire({
                title: 'Success!',
                text: 'You have successfully logged in.',
                icon: 'success',
                confirmButtonText: 'Proceed'
            }).then(() => {
                window.location.href = '/dashboard.html';
            });
        }
    
        return data;
    } catch (error) {
        console.log(error);
        Swal.fire({
            title: 'Error!',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'Try Again'
        });
    }
    
}
if (Signinbtn) {
    Signinbtn.addEventListener("click", signIn);
}

//************************* Check Session ************************

async function checkSession() {
    try {
        const { data, error } = await supabase.auth.getSession();

        const authPages = ["/index.html", "/login.html", "/"];
        const currentPath = window.location.pathname;
        console.log(currentPath);
        const isAuthPage = authPages.some((page) => page.includes(currentPath));

        const { session } = data;
        console.log(session);

        if (session) {
            if (isAuthPage) {
                window.location.href = '/dashboard.html'
            }
        } else {
            if (!isAuthPage) {
                window.location.href = '/login.html'
            }
        }

    } catch (error) {
        console.log(error);
    }
}

window.onload = checkSession;

//************************* Sign Out ************************

async function logout() {
    try {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, log me out!',
            cancelButtonText: 'No, keep me logged in'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                window.location.href = "/login.html";
            }
        });
    } catch (error) {
        console.log(error);
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}
