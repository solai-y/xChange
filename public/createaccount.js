var registerDB = null;
function register_form(e) {
    db = firebase.firestore();
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (name == "" || email == "" || password == "") {
        // Show the warning message
        document.getElementById("warning").style.display = "block";
        return false; // Prevent the form from submitting
    }else{

    var registerDB = db.collection("Users");
    registerDB.add({
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

    document.getElementById("registration").reset()
}
}


function account_login(e){
    var email = document.getElementById("email_login").value;
    var password = document.getElementById("password_login").value;
    var db = firebase.firestore();
    var usersCollection = db.collection("Users");

    // Query Firestore to check if the email and password match
    usersCollection.where("email", "==", email).where("password", "==", password)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.size === 1) {
                // Successful login - redirect to "university.html"
                window.location.href = "university.html";
            } else {
                // Invalid credentials
                console.error("Invalid email or password.");
            }
        });
    }