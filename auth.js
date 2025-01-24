let SignupEmail = document.getElementById('signup-email')
let SignupPass = document.getElementById('signup-password')
let Signupbtn = document.getElementById('signup-btn')
let SigninEmail = document.getElementById('signin-email')
let SigninPass = document.getElementById('signin-password')
let Signinbtn = document.getElementById('signin-btn')
let signupBtnLoader = document.getElementById("loading_btn_spinner");
let SignupName = document.getElementById("signup_name");


async function signUp() {
    try {
        // signupBtnLoader.style.display = "block";
        const { data, error } = await supabase.auth.signUp({
            email: SignupEmail.value,
            password: SignupPass.value,
        })
        // console.log(data)
        if (error) throw error
        if (data) {
            alert('Please Check your email for confirmation')
            // alert(SignupName.value)
            // alert(data.user.id);
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
    // finally {
    //     signupBtnLoader.style.display = "none";}
}
if (Signupbtn) {
    Signupbtn.addEventListener("click", signUp);
}


async function signIn() {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: SigninEmail.value,
            password: SigninPass.value,
        })
        if (error) throw error
        if (data) {
            // alert('Welcome')
            window.location.href = '/dashboard.html'
            // console.log(data)
        }
        return data
    } catch (error) {
        console.log(error)
        alert(error.message)

    }
}
if (Signinbtn) {
    Signinbtn.addEventListener("click", signIn);
}