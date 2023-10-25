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

// aws key info needed to be passes here
const AWS_ACCESS_KEY_ID= 'AKIAXKQEJUDLDKV45O7O';
const AWS_SECRET_ACCESS_KEY= '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';
const AWS_REGION= 'us-east-1';


AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION
});

const s3 = new AWS.S3();

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
            var imageInput2 = document.getElementsByClassName("profilepicture2")[0]; // processed below
            var imageInput1 = document.getElementsByClassName("profilepicture")[0]; // processed below

            if (imageInput2) {
              // retrieves image info from database
              if (typeof reviewData.image_url !== 'undefined') {
                  // Create a URL for the selected image and set it as the src of the profile image
                  imageInput2.src = reviewData.image_url;
              } else {
                  // If no file is selected or the selection is canceled, you can set a default image
                  imageInput2.src = "./images/profile photo.jpeg";
              }
            }

            if (imageInput1) {
              if (typeof reviewData.image_url !== 'undefined') {
                  // Create a URL for the selected image and set it as the src of the profile image
                  imageInput1.src = reviewData.image_url;
              } else {
                  // If no file is selected or the selection is canceled, you can set a default image
                  imageInput1.src = "./images/profile photo.jpeg";
              }
            }


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
            var imageButton = document.getElementById("imageInput");

            imageButton.addEventListener("change", function () {
              // when image is uploaded create a link for the image
              const file = imageInput.files[0];
              if (file) {
                  // AWS params
                  const params = {
                      Bucket: "xchange-users",
                      Key: data.uid, // The unique key for the image might need to use UID here?
                      Body: file
                  }
                  // send info to AWS
                  s3.upload(params, (err, data) => {
                      // console.log("loading")
                      if (err) {
                          console.error('S3 upload error:', err);
                      } else {
                          // store the url in a hidden input field
                          document.getElementById("imageInputUrl").value = data.Location
                          // console.log('Image uploaded:', data.Location);
                      }
                  });
              }
          });

            saveButton.addEventListener("click", function(e){
              e.preventDefault();

              userCollection.update({
                name : document.getElementById("first_name").value,
                phone_number : document.getElementById("phone_number").value,
                primary_degree : document.getElementById("primary_degree").value,
                secondary_degree : document.getElementById("secondary_degree").value,
                image_url: document.getElementById("imageInputUrl").value
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

        var removeImageButton = document.getElementById("removeImage");

        var imageInput2 = document.getElementsByClassName("profilepicture2")[0]; // processed below
        var imageInput1 = document.getElementsByClassName("profilepicture")[0]; // processed below

        removeImageButton.addEventListener("click", function() {
                // Set the image URL in the database to the default URL
                userCollection.update({
                    image_url: "" // Update this URL to your default image
                })
                .then(function() {
                    // Update the image element to display the default image
                    if (imageInput2) {
                        imageInput2.src = "./images/profile photo.jpeg";
                    }
                    if (imageInput1) {
                        imageInput1.src = "./images/profile photo.jpeg";
                    }
                    console.log("Profile photo removed and database updated!");
                })
                .catch(function(error) {
                    console.error("Error updating document: ", error);
                    // Handle the error, e.g., show an error message
                });
            
        });
        console.log(imageInput1.src);

        document.addEventListener("keydown", function (e) {
          if (e.key === "Enter") {
              e.preventDefault();
          }
      });
    
    const forgotPasswordButton = document.getElementById("resetPasswordButton");
    const resetEmailField = document.getElementById("email");

    // Add a click event listener to the "Forgot Password" button
    forgotPasswordButton.addEventListener("click", (e) => {
        e.preventDefault();
    
        // Get the user's email from the input field
        const email = resetEmailField.value;
        console.log(email);

        // Use Firebase's password reset functionality
        if (email){
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                // Password reset email sent successfully
                console.log("Password reset email sent. Check your email.");
            })
            .catch((error) => {
                // Handle any errors that occur during the password reset process
                console.error("Error sending password reset email:", error);
            });
        }
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
            sessionStorage.setItem("user",user.displayName);
        })
        .catch(err => {
            console.log("Error during sign-in:",err);
        })
};

});
