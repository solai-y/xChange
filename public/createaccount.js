
// register
const registerForm = document.getElementById("registration");
const registerSubmitButton = document.getElementById("registerSubmit");
registerSubmitButton.addEventListener("click", (e) => {
    e.preventDefault();
    // getting users inputs
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmpassword = document.getElementById("confirmpassword").value;
    auth.createUserWithEmailAndPassword(email, password).then(cred=>{
        // sets docid ac the credential id that is automatically generated
        return db.collection("Users").doc(cred.user.uid).set({
            name: name,
            // allows u to provide other input field to store in the database
        })
    }).then(() => {
        // function that runs when the data successfully added to the database
        registerForm.reset()

    });
});


// log in
const loginForm = document.getElementById("login_page"); // Assuming you have a form with the id "login"
const loginSubmitButton = document.getElementById("loginSubmit");
loginSubmitButton.addEventListener("click", (e) => {
    e.preventDefault();

    // Getting user's login credentials
    let email = document.getElementById("email_login").value;
    let password = document.getElementById("password_login").value;

    // Authenticate the user with Firebase
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // successful login
            var user = userCredential.user;
            console.log("Welcome, " + user.displayName + "!");
            console.log(user)
            sessionStorage.setItem('user', JSON.stringify(user));
            // email verification
            if (!user.emailVerified) {
                user.sendEmailVerification().then(e=> {
                    console.log("email verification has been sent!");
                    // console.log(e.message);
                }).catch(e=> {
                    // console.log(e.message);
                });
            }
            window.location.href = "./university.html"
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error("Error logging in: " + errorMessage);
        });
});
