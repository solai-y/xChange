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

function getAllUniversitiesFirebase() {
    db = firebase.firestore();
    var uniCollection = db.collection("University");
    var isFirstItem = true;

    uniCollection.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // Create a new carousel item
            let individualCard = document.createElement('div');
            individualCard.classList.add('carousel-item');

            if (isFirstItem) {
                individualCard.classList.add('active');
                isFirstItem = false;
              }

            // Create an image element
            let uniPhoto = document.createElement('img');
            uniPhoto.classList.add('bd-placeholder-img', 'card-img-top', 'w-30', 'h-30');
            uniPhoto.src = doc.data().gallery[0]; // Assuming the first image in the gallery is used

            // Create a div for the caption
            let cardContent = document.createElement('div');
            cardContent.classList.add('carousel-caption', 'd-none', 'd-md-block');

            // Create elements for name and country
            let uniName = document.createElement('h3');
            let uniCountry = document.createElement('p');

            // Set text content for name and country
            uniName.textContent = doc.data().name;
            uniCountry.textContent = doc.data().country;

            // Append the image, caption, name, and country to the carousel item
            individualCard.appendChild(uniPhoto);
            individualCard.appendChild(cardContent);
            cardContent.appendChild(uniName);
            cardContent.appendChild(uniCountry);

            // Append the carousel item to the #picture div
            document.getElementById('picture').appendChild(individualCard);

        });

    }).catch(function (error) {
        console.error("Error getting documents:", error);
    });

    
}

// Call the function when the DOM is ready
document.addEventListener("DOMContentLoaded", event => {
    getAllUniversitiesFirebase();
});

function updateTypewriterText() {
    db = firebase.firestore();
    var uniCollection = db.collection("University");
  
    uniCollection.get().then(function (querySnapshot) {
      const dynamicTextElement = document.getElementById("dynamicText");
  
      querySnapshot.forEach(function (doc) {
        // Assuming you have a field in your Firebase document named 'text'
        const dynamicText = doc.data().name;
  
        // Split the text into an array of phrases, assuming phrases are separated by commas
        const phrases = dynamicText.split(',');
  
        // Initialize index and type speed
        let index = 0;
        let period = 2000;
  
        // Function to update the text dynamically
        function updateText() {
          dynamicTextElement.textContent = phrases[index];
          index = (index + 1) % phrases.length;
        }
  
        // Call the function to start the typewriter effect
        setInterval(updateText, period);
      });
    }).catch(function (error) {
      console.error("Error getting documents:", error);
    });
  }
  
  // Call the function when the DOM is ready
  document.addEventListener("DOMContentLoaded", event => {
    updateTypewriterText();
  });
  