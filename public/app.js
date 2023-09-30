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

    // Check the user's authentication status
    firebase.auth().onAuthStateChanged(function(user) {
        if (!user) { // need to adjust this value to correct web host
            // User is not authenticated, redirect to the login page
            // if (window.location.href!='https://xchange-2af7e.web.app') {
            //     // window.location.href = 'https://xchange-2af7e.web.app'; // Change 'index.html' to your login page URL
            // }
        } else {
            // User is authenticated, you can continue with other logic
            // connect to the firebase server database
            db = firebase.firestore();
            //connect to a data source in firebase
            var reviewsCollection = db.collection("Reviews");
        
            reviewsCollection.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // doc.data() contains the data for each document in the collection
                    var reviewData = doc.data();
                    console.log(reviewData); // tbr
                });
            }).catch(function(error) {
                console.error("Error getting documents:", error);
            });
        }
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
        window.location.href = "./university.html";
    })
    .catch(err => {
        console.log(err);
    })

}