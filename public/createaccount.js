function eMessage(error){

    let errorCode = error;
    let errorMessage = "";

    switch(errorCode) {
        case "auth/invalid-email":
          errorMessage = "Email is invalid or not filled.";
          break;
        case "auth/missing-password":
          errorMessage = "Password is not filled.";
          break;
        case "auth/invalid-login-credentials":
          errorMessage = "Email or password is incorrect.";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "Email is already in use.";
          break;
        case "auth/password-not-matching":
          errorMessage = "Password is not matching.";
          break;
        case "auth/missing-all-fields":
            errorMessage = "All fields are empty.";
            break;
        case "auth/missing-name":
            errorMessage = "Name is empty.";
            break;
        case "auth/clear":
            errorMessage = "Account successfully created.";
            break;
        default:
          errorMessage = "Error";
      }

      return errorMessage;
}

function errorDisplay(errorMessage, errorField){
    let oldP = "";
    oldP = document.getElementById(errorField).firstChild;
    let newP = document.createElement("p")
    let tnP = document.createTextNode(errorMessage);
    newP.appendChild(tnP);
    newP.style.fontSize = "12px";
    if(errorMessage == "Account successfully created."){
        newP.style.color = "green";
    }else{
        newP.style.color = "red";
    }
    if(oldP == ""){
        document.getElementById(errorField).appendChild(newP);

    }else{
        document.getElementById(errorField).replaceChild(newP, oldP);
    }
}


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
    if (typeof auth === "undefined") {
        auth = firebase.auth();
    }



    // checks if the password and confirm password matches
    if(name=="" && email=="" && password=="" && confirmpassword==""){
        errorMessage = eMessage("auth/missing-all-fields");
        errorDisplay(errorMessage, "errorFieldR");
    }
    else if(name==""){
        errorMessage = eMessage("auth/missing-name");
        errorDisplay(errorMessage, "errorFieldR");
    }
    else if(password != confirmpassword){
        errorMessage = eMessage("auth/password-not-matching");
        errorDisplay(errorMessage, "errorFieldR");
    }
    else{
        auth.createUserWithEmailAndPassword(email, password).then(cred=>{
            // sets doc id ac the credential id that is automatically generated
            return db.collection("Users").doc(cred.user.uid).set({
                name: name,
                // allows u to provide other input field to store in the database
            })
        }).then(() => {
            // function that runs when the data successfully added to the database
            registerForm.reset()
            errorMessage = eMessage("auth/clear");
            errorDisplay(errorMessage, "errorFieldR");

        }).catch((error) => {
            var errorCode = error.code;
            var error = error.message;
            var errorMessage = "";
            console.error(errorCode);
            console.error("Error logging in: " + error);
            errorMessage = eMessage(errorCode);
            errorDisplay(errorMessage, "errorFieldR");
    })};
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
            console.log(errorCode)
            var error = error.message;
            var errorMessage = "";
            console.error(errorCode);
            console.error("Error logging in: " + error);
            errorMessage = eMessage(errorCode);
            errorDisplay(errorMessage, "errorField");
        });
});
