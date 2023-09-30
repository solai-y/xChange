// Firebase Info
const firebaseConfig = {
    apiKey: "AIzaSyA7ogQ3Eqn-tu_2NYnzHfo-ARsYwR5hSKg",
    authDomain: "xchange-2af7e.firebaseapp.com",
    projectId: "xchange-2af7e",
    storageBucket: "xchange-2af7e.appspot.com",
    messagingSenderId: "663333771385",
    appId: "1:663333771385:web:a0c12e9499e1d78e7adca8",
    measurementId: "G-94L4SG8ZW0"
};

document.addEventListener("DOMContentLoaded", event=> {
    // initialize firebase
    const app = firebase.initializeApp(firebaseConfig);
    // prints the firebase connection to check for bugs
    console.log(app); 

    db = firebase.firestore();
    //connect to a data source in firebase
    var reviewsCollection = db.collection("Reviews");

    reviewsCollection.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() contains the data for each document in the collection
            var reviewData = doc.data();
            console.log(reviewData);
        });
    }).catch(function(error) {
        console.error("Error getting documents:", error);
    });

});

// function to log in with google account (fully functional but need to test failed)
function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    // log in promise
    firebase.auth().signInWithPopup(provider)
    .then(result => {
        const user = result.user;
        document.write(`Hello ${user.displayName}`)
        console.log(user); // tbr
    })
    .catch(err => {
        console.log(err);
    })
}