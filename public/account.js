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

document.addEventListener("DOMContentLoaded", event => {
    // initialize firebase



    // comment out the below line when deploying
    if (typeof app == 'undefined') {
        const app = firebase.initializeApp(firebaseConfig);
    }

    // prints the firebase connection to check for bug
    // console.log(app);
    if (typeof db== 'undefined') {
        db = firebase.firestore();
        auth = firebase.auth();
    }
    //connect to a data source in firebase
    var userCollection = db.collection("Users").doc(data.uid);
    console.log(userCollection);
    userCollection.get().then(function (doc) {
        if (doc.exists) {
            // doc.data() contains the data for the specific document
            var reviewData = doc.data();
            console.log(reviewData);
            var nameInput = document.getElementById("first_name");
            var phonenumberInput = document.getElementById("phone_number");
            var primarydegreeInput = document.getElementById("primary_degree");
            var secondarydegreeInput = document.getElementById("secondary_degree");
            var headerName = document.getElementById("headerName");

            headerName.textContent = reviewData.name;
            nameInput.value = reviewData.name;

            if (phonenumberInput) {
                if (typeof reviewData.phone_number !== 'undefined') {
                  phonenumberInput.value = reviewData.phone_number;
                } else {
                  phonenumberInput.value = "";
                }
              } else {
                phonenumberInput.value = "";
              }
              

              if (primarydegreeInput) {
                if (typeof reviewData.primary_degree !== 'undefined') {
                  primarydegreeInput.value = reviewData.primary_degree;
                } else {
                  primarydegreeInput.value = "";
                }
              } else {
                primarydegreeInput.value = "";
              }
              

              if (secondarydegreeInput) {
                if (typeof reviewData.secondary_degree !== 'undefined') {
                  secondarydegreeInput.value = reviewData.secondary_degree;
                } else {
                  secondarydegreeInput.value = "";
                }
              } else {
                secondarydegreeInput.value = "";
              }
              

            // save data
            var saveButton = document.getElementById("save");

            saveButton.addEventListener("click", function(e){
              e.preventDefault();

              userCollection.update({
                name : document.getElementById("first_name").value,
                phone_number : document.getElementById("phone_number").value,
                primary_degree : document.getElementById("primary_degree").value,
                secondary_degree : document.getElementById("secondary_degree").value
              })
              .then(function() {
                    // Show the notification
                var notification = document.getElementById("notification");
                notification.style.display = "block";

                // Optionally, you can hide the notification after a few seconds
                setTimeout(function() {
                  notification.style.display = "none";
                }, 3000); // Hide after 3 seconds (adjust as needed)
                console.log("Document successfully updated!");
                // Optionally, you can redirect or show a success message
                
            })
            .catch(function(error) {
                console.error("Error updating document: ", error);
                // Handle the error, e.g., show an error message
            });
            });
        } else {
            // Document doesn't exist
            console.log("Document does not exist.");
        }
    }).catch(function (error) {
        console.error("Error getting the document:", error);
    });

    



    const forgotPasswordButton = document.getElementById("resetPassword");
    const resetEmailField = document.getElementById("email");

    // Add a click event listener to the "Forgot Password" button
    forgotPasswordButton.addEventListener("click", (e) => {
        e.preventDefault();
    
        // Get the user's email from the input field
        const email = resetEmailField.value;
        console.log(email);

        // Use Firebase's password reset functionality
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                // Password reset email sent successfully
                console.log("Password reset email sent. Check your email.");
            })
            .catch((error) => {
                // Handle any errors that occur during the password reset process
                console.error("Error sending password reset email:", error);
            });
          })

    });





//function to log in with google account (fully functional but need to test failed)
function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    // log in promise
    firebase.auth().signInWithPopup(provider)
        .then(result => {
          console.log(result);
            const user = result.user;
            document.write(`Hello ${user.displayName}`)
            console.log(user); // tbr
            window.location.href = "./university.html";
        })
        .catch(err => {
            console.log("Error during sign-in:",err);
        })
};


