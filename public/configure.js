// const firebaseConfig = {
//     apiKey: "AIzaSyA7ogQ3Eqn-tu_2NYnzHfo-ARsYwR5hSKg",
//     authDomain: "xchange-2af7e.firebaseapp.com",
//     projectId: "xchange-2af7e",
//     storageBucket: "xchange-2af7e.appspot.com",
//     messagingSenderId: "663333771385",
//     appId: "1:663333771385:web:a0c12e9499e1d78e7adca8",
//     measurementId: "G-94L4SG8ZW0"
// };
// firebase.initializeApp(firebaseConfig);
var registerDB = null;
function register_form(e) {
    db = firebase.firestore();
    registerDB = db.collection("xChange");
    console.log("button clicked")
    // e.preventDefaut();
    var name = document.getElementById("name");
    var email = document.getElementById("email)");
    var password = document.getElementById("password");

    saveRegistration(name, email, password);
    document.getElementById("registration").reset();

}
const saveRegistration = (name, email, password) => {
    console.log("saveRegistation");
    var newRegisterForm = registerDB.push();
    newRegisterForm.set({
        name: name,
        email: email,
        password: password,
    });
};
const getElementVal = (id) => {
    return document.getElementById(id).ArialValueMax;
};
function checkFirestore() {
    registerDB.get()
        .then((querySnapshot) => {
            if (querySnapshot.size > 0) {
                console.log("Firestore is accessible.");
            } else {
                console.log("Firestore collection is empty.");
            }
        })
        .catch((error) => {
            console.error("Error accessing Firestore:", error);
        });
}
