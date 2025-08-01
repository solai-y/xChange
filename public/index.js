// for search bar
var content = [];

function getAllUniversities() {
    axios.get('./universities', {
        params: {
            
        }
    })
    .then(response => {
        for (let university of response.data) {
            console.log(response.data);
            // elements of row data and card
            // let individualCard = document.createElement('div');
            // let uniPhoto = document.createElement('svg');
            // let cardContent = document.createElement('div');
            // let uniName = document.createElement('p');
            // let viewSection = document.createElement('div');
            // let viewButton = document.createElement('div');
            // let viewName = document.createElement('button');
            


            // // text nodes
            // let tnUniName = document.createTextNode(doc.name);
            // let btnName = document.createTextNode('Explore');
            // // setting card classes
            // individualCard.setAttribute('class', 'card shadow-sm');
            // uniPhoto.setAttribute('class', 'bd-placeholder-img card-img-top');
            // cardContent.setAttribute('class', 'card-body');
            // uniName.setAttribute('class', 'card-title');
            // viewSection.setAttribute('class', 'd-flex justify-content-between align-items-center');
            // viewButton.setAttribute('class', 'btn-group');
            // viewName.setAttribute('class', 'btn btn-sm btn-outline-secondary');
            
            // // a.setAttribute('href', university.webpages[0]);

            // // appending children
            // uniName.appendChild(tnUniName);
            // cardContent.appendChild(uniName);
            // individualCard.appendChild(cardContent);
            // individualCard.appendChild(uniPhoto);
            // viewName.appendChild(btnName);
            // viewButton.appendChild(viewName);
            // viewSection.appendChild(viewButton);
            // cardContent.appendChild(viewSection);
            


            // document.getElementById('uniResults').appendChild(individualCard)

        }
    })
    .catch( error => {
        console.log(error.message);
    });
}

// function getAllUniversitiesFirebase() {
//     db = firebase.firestore();
//     var uniCollection = db.collection("University");
//     var isFirstItem = true;

//     uniCollection.get().then(function (querySnapshot) {
//         querySnapshot.forEach(function (doc) {
//             // Create a new carousel item
//             let individualCard = document.createElement('div');
//             individualCard.classList.add('carousel-item');

//             if (isFirstItem) {
//                 individualCard.classList.add('active');
//                 isFirstItem = false;
//               }

//             // Create an image element
//             let uniPhoto = document.createElement('img');
//             uniPhoto.classList.add('bd-placeholder-img', 'card-img-top', 'w-10', 'h-10');
//             uniPhoto.src = doc.data().gallery[0]; // Assuming the first image in the gallery is used

//             // Create a div for the caption
//             let cardContent = document.createElement('div');
//             cardContent.classList.add('carousel-caption', 'd-none', 'd-md-block');

//             // Create elements for name and country
//             let uniName = document.createElement('h3');
//             let uniCountry = document.createElement('p');

//             // Set text content for name and country
//             uniName.textContent = doc.data().name;
//             uniCountry.textContent = doc.data().country;

//             // Append the image, caption, name, and country to the carousel item
//             individualCard.appendChild(uniPhoto);
//             individualCard.appendChild(cardContent);
//             cardContent.appendChild(uniName);
//             cardContent.appendChild(uniCountry);

//             // Append the carousel item to the #picture div
//             document.getElementById('picture').appendChild(individualCard);

//         });

//     }).catch(function (error) {
//         console.error("Error getting documents:", error);
//     });

    
// }

// // Call the function when the DOM is ready
// document.addEventListener("DOMContentLoaded", event => {
//     getAllUniversitiesFirebase();
// });



    // Your existing code for Firebase Firestore query
// Initialize Firebase (if not done already)
// Replace with your own Firebase configuration
// Your existing code for Firebase Firestore query
// Initialize Firebase (if not done already)
// Replace with your own Firebase configuration
document.addEventListener("DOMContentLoaded", function() {
    const db = firebase.firestore();
    const uniCollection = db.collection("University");
    const track = document.getElementById('trackItem'); // Get the ul element for the list

    function createCard(link, name, country, imageUrl) {
        const listItem = document.createElement('li'); // Create a list item for the card
        listItem.classList.add('card'); // Add appropriate classes for styling
    
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');
    
        const redirection = document.createElement('a');
        redirection.href = `./individualunipage.html?uni=${link}`;
    
        const cardImage = document.createElement('img');
        cardImage.src = imageUrl;
        cardImage.alt = `${name} Image`;
    
        const cardTitle = document.createElement('h2');
        cardTitle.textContent = name;
    
        const cardCountry = document.createElement('p');
        cardCountry.textContent = country;
    
        redirection.appendChild(cardImage); // Wrap the image with the anchor tag
    
        cardContent.appendChild(cardTitle);
        cardContent.appendChild(cardCountry);
    
        listItem.appendChild(redirection); // Add the anchor tag to the list item
        listItem.appendChild(cardContent);
    
        return listItem;
    }
    
    

    function populateList(querySnapshot) {
        querySnapshot.forEach((doc) => {
            const card = createCard(doc.id, doc.data().name, doc.data().country, doc.data().gallery[0]);
            track.appendChild(card); // Append the card to the list
        });
    }

    // Fetch data from Firestore and populate the list
    uniCollection.get().then((querySnapshot) => {
        populateList(querySnapshot);
        startContinuousLoop();
    }).catch((error) => {
        console.error("Error getting documents: ", error);
    });

    function startContinuousLoop() {
        const cardWidth = track.querySelector('.card').offsetWidth;

        const cloneCount = Math.ceil(track.offsetWidth / cardWidth);
        const totalWidth = cloneCount * cardWidth;

        track.style.animation = `scroll ${totalWidth / 300}px linear infinite`;

        // Clone the list items to create a continuous loop
        const cardListItems = track.querySelectorAll('.card');
        for (let i = 0; i < cloneCount; i++) {
            for (const card of cardListItems) {
                const clonedCard = card.cloneNode(true);
                track.appendChild(clonedCard);
            }
        }
    }
});









// Your existing code for Firebase Firestore query
// Initialize Firebase (if not done already)
// Replace with your own Firebase configuration
// Your existing code for Firebase Firestore query
// Initialize Firebase (if not done already)
// Replace with your own Firebase configuration
document.addEventListener("DOMContentLoaded", function() {
  const db = firebase.firestore();
  const uniCollection = db.collection("University");

  const dynamicTextElement = document.getElementById('dynamicText');

  // Initialize an array to store university names
  const universityNames = [];
  let currentIndex = 0;
  let currentText = '';
  let typingInterval;
  
  uniCollection.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
          universityNames.push(doc.data().name);
      });

      if (universityNames.length > 0) {
          // Start typing effect
          typingInterval = setInterval(function () {
              const name = universityNames[currentIndex];
              if (currentText.length < name.length) {
                  currentText += name[currentText.length];
                  dynamicTextElement.textContent = currentText;
              } else {
                  // Text is fully typed, wait for a moment, then clear it
                  clearInterval(typingInterval);
                  setTimeout(function () {
                      eraseText();
                  }, 1000); // Adjust the pause before erasing text if needed
              }
          }, 100); // Adjust the typing speed (in milliseconds) if needed
      } else {
          dynamicTextElement.textContent = "No universities found.";
      }
  }).catch(function (error) {
      console.error("Error getting documents:", error);
  });

  function eraseText() {
      // Start erasing the text
      typingInterval = setInterval(function () {
          if (currentText.length > 0) {
              currentText = currentText.slice(0, -1);
              dynamicTextElement.textContent = currentText;
          } else {
              // Text is fully erased, move to the next name
              clearInterval(typingInterval);
              currentIndex = (currentIndex + 1) % universityNames.length;
              setTimeout(function () {
                  dynamicTextElement.textContent = ''; // Clear the text before typing the next name
                  typingInterval = setInterval(function () {
                      const name = universityNames[currentIndex];
                      if (currentText.length < name.length) {
                          currentText += name[currentText.length];
                          dynamicTextElement.textContent = currentText;
                      } else {
                          // Text is fully typed, wait for a moment, then clear it
                          clearInterval(typingInterval);
                          setTimeout(function () {
                              eraseText();
                          }, 1000); // Adjust the pause before erasing text if needed
                      }
                  }, 100); // Adjust the typing speed (in milliseconds) if needed
              }, 1000); // Adjust the pause before typing the next name if needed
          }
      }, 100); // Adjust the erasing speed (in milliseconds) if needed
  }
});

$(document).ready(function () {
    $('#imageCarousel').carousel(); // Start the carousel
  });

  function fixJavansProblems() {
    if (sessionStorage.getItem("user")) {
        var userData = JSON.parse(sessionStorage.getItem("user"));
        if (typeof app == 'undefined') {
            const app = firebase.initializeApp(firebaseConfig);
        }
    
        // prints the firebase connection to check for bug
        // console.log(app);
        if (typeof db== 'undefined') {
            db = firebase.firestore();
            auth = firebase.auth();
        }
        // create elements for someone that is logged in
        let anchor = document.createElement('a');
        let imgTag = document.createElement('img');
        anchor.setAttribute('href', './account.html');
        anchor.setAttribute('class', 'avatar rounded-circle text-white d-none d-lg-flex');
        imgTag.setAttribute('class','profilepicture');
        //connect to a data source in firebase
        var userCollection = db.collection("Users").doc(userData.uid);
        userCollection.get().then(function (doc) {
            let reviewData = doc.data()
            if (reviewData && reviewData.image_url) {
                imgTag.src = reviewData.image_url
            } else {
                imgTag.src = './images/profile photo.jpeg';
            }
        })
        anchor.appendChild(imgTag);
        document.getElementById("signUpLogInImage").appendChild(anchor);
    } else{
        let ul = document.createElement('ul');
        let li1 = document.createElement('li');
        let li2 = document.createElement('li');
        let a1 = document.createElement('a');
        let a2 = document.createElement('a');
        ul.setAttribute('class','navbar-nav');
        a1.setAttribute('class','nav-link active');
        a2.setAttribute('class','nav-link active');
        li1.setAttribute("class", "nav-item");
        li2.setAttribute("class", "nav-item");
        a1.setAttribute('href','./login_page.html');
        a2.setAttribute('href','./login_page.html');
        let a1tn = document.createTextNode("Register")
        let a2tn = document.createTextNode("Log In")
        a1.appendChild(a1tn);
        a2.appendChild(a2tn);
        li1.appendChild(a1);
        li2.appendChild(a2);
        ul.appendChild(li1);
        ul.appendChild(li2);
        document.getElementById("signUpLogInImage").appendChild(ul)
    
    }
}

document.addEventListener("DOMContentLoaded", event => {
    fixJavansProblems();
});








