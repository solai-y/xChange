var registerDB = null;
function register_form(e) {
    db = firebase.firestore();
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    if (name == "" || email || "" || password == "") {
        // Show the warning message
        console.log(name);
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


function account_login(e) {
    console.log("account_login function is executing...");
    var email = document.getElementById("email_login").value;
    var password = document.getElementById("password_login").value;
    var db = firebase.firestore();
    var usersCollection = db.collection("Users");


    // Query Firestore to check if the email and password match
    usersCollection.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            var userData = doc.data();
            var userCredentialsArray = userData.credentials; // Assuming credentials is an array in each document
            
            // Iterate through each set of credentials in the array
            userCredentialsArray.forEach((credentials) => {
                var storedEmail = credentials.email;
                var storedPassword = credentials.password;
            
                // Check if the provided email and password match the stored credentials
                if (email === storedEmail && password === storedPassword) {
                    // Successful login
                    var name = userData.name;
                    
                    console.log("Welcome, " + name + "!");
                    // You can redirect the user to a secure page here
                    return; // Exit the loop
                }
                localStorage.setItem("email",email);
            });
        });

        // If the loop finishes and no match is found, it's an invalid login
        console.error("Invalid email or password.");
    })
    .catch((error) => {
        console.error("Error logging in: ", error);
    });
}




