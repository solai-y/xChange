var registerDB = null;
function register_form(e) {
    db = firebase.firestore();
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


