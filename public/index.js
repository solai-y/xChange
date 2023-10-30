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
document.addEventListener("DOMContentLoaded", function() {
    const db = firebase.firestore();
    const uniCollection = db.collection("University");
    const carousel = document.querySelector('.carousel');
  
    // Set the number of cards to display at once
    const cardsPerPage = 3;
    const transitionInterval = 3000; // Transition every 3 seconds
  
    let currentIndex = 0;
  
    function createCard(name, country, imageUrl) {
        const card = document.createElement('div');
        card.classList.add('card');
      
        const cardImage = document.createElement('img');
        cardImage.src = imageUrl;
        cardImage.alt = `${name} Image`;
      
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');
      
        const cardTitle = document.createElement('h2');
        cardTitle.textContent = name;
      
        const cardCountry = document.createElement('p');
        cardCountry.textContent = country;
      
        cardContent.appendChild(cardTitle);
        cardContent.appendChild(cardCountry);
      
        card.appendChild(cardImage);
        card.appendChild(cardContent);
      
        return card;
      }
  
    function populateCarousel(querySnapshot) {
      const cards = [];
      querySnapshot.forEach((doc) => {
        cards.push(createCard(doc.data().name, doc.data().country, doc.data().gallery[0]));
      });
  
      const totalCards = cards.length;
  
      function updateCarousel() {
        const start = currentIndex % totalCards;
        const end = (currentIndex + cardsPerPage) % totalCards;
        const visibleCards = cards.slice(start, end);
  
        // Clear and populate the carousel
        carousel.innerHTML = '';
        visibleCards.forEach(card => carousel.appendChild(card));
  
        // Update currentIndex
        currentIndex = (currentIndex + 1) % totalCards;
  
        // Schedule the next update
        setTimeout(updateCarousel, transitionInterval);
      }
  
      // Start the continuous loop
      updateCarousel();
    }
  
    // Fetch data from Firestore and populate the carousel
    uniCollection.get().then((querySnapshot) => {
      populateCarousel(querySnapshot);
    }).catch((error) => {
      console.error("Error getting documents: ", error);
    });
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

