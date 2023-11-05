
// for search bar
var content = [];

function getAllUniversities() {
    axios.get('./universities', {
        params: {
            
        }
    })
    .then(response => {
        for (let university of response.data) {
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
    //connect to a data source in firebase
    var uniCollection = db.collection("University");

    uniCollection.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            
            // doc.data() contains the data for each document in the collection
            let docId = doc.id;
            let redirection = document.createElement("a");
            let individualCard = document.createElement('div');
            let uniPhoto = document.createElement('img');
            let cardContent = document.createElement('div');
            let uniName = document.createElement('p');
            let viewSection = document.createElement('div');
            let viewButton = document.createElement('div');
            let viewName = document.createElement('button');
            


            // text nodes
            let tnUniName = document.createTextNode(doc.data().name);
            let btnName = document.createTextNode('Explore');
            let imageLink = doc.data().gallery[0]
            // setting card classes
            individualCard.setAttribute('class', 'card shadow-sm');
            uniPhoto.setAttribute('class', 'bd-placeholder-img card-img-top');
            uniPhoto.setAttribute('src', imageLink);
            cardContent.setAttribute('class', 'card-body');
            uniName.setAttribute('class', 'card-title');
            viewSection.setAttribute('class', 'd-flex justify-content-between align-items-center');
            viewButton.setAttribute('class', 'btn-group');
            viewName.setAttribute('class', 'btn btn-sm btn-outline-secondary');
            redirection.setAttribute('href', `./individualunipage.html?uni=${docId}`);
            redirection.setAttribute('id', docId);

            // creating dictionary for content variable (later used for searching)
            let info = {"name": doc.data().name, "country": doc.data().country, "element": redirection};
            content.push(info);

            // appending children
            uniName.appendChild(tnUniName);

            // Appending uniPhoto before cardContent
            individualCard.appendChild(uniPhoto);
            individualCard.appendChild(cardContent);

            cardContent.appendChild(uniName);
            cardContent.appendChild(viewSection);
            viewName.appendChild(btnName);
            viewButton.appendChild(viewName);
            viewSection.appendChild(viewButton);

            redirection.appendChild(individualCard);


            document.getElementById('uniResults').appendChild(redirection);
        });
    }).catch(function (error) {
        console.error("Error getting documents:", error);
    });
}


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
            if (reviewData.image_url) {
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
    getAllUniversitiesFirebase();
    fixJavansProblems();
});


//search processing
const searchUniName = document.querySelector("[data-search-uni-name]");
const searchCountryName = document.querySelector("[data-search-country-name]");

searchUniName.addEventListener("input", (e) => {
    let uniSearchValue = e.target.value.toLowerCase();
    let countrySearchValue = searchCountryName.value.toLowerCase(); // Get the country search value
    content.forEach(user => {
        let isVisible = user.name.toLowerCase().includes(uniSearchValue) && user.country.toLowerCase().includes(countrySearchValue);
        user.element.classList.toggle("hide", !isVisible);
    });
});

searchCountryName.addEventListener("input", (e) => {
    let countrySearchValue = e.target.value.toLowerCase();
    let uniSearchValue = searchUniName.value.toLowerCase(); // Get the university search value
    content.forEach(user => {
        let isVisible = user.name.toLowerCase().includes(uniSearchValue) && user.country.toLowerCase().includes(countrySearchValue);
        user.element.classList.toggle("hide", !isVisible);
    });
});

const searchSuggestionUniName = document.getElementById("suggestionListUniName");
const searchSuggestionCountryName = document.getElementById("suggestionListCountryName");

searchUniName.addEventListener("input", function () {
    const userInput = searchUniName.value.toLowerCase();

    // Clear the suggestion list
    searchSuggestionUniName.innerHTML = "";

    // Filter and display suggestions based on user input
    const filteredSuggestions = content.filter(user => {
        return user.name.toLowerCase().includes(userInput);
    });

    if(filteredSuggestions.length == 0) {
        const noResultsMessage = document.createElement("div");
        noResultsMessage.textContent = "No results found";
        searchSuggestionUniName.appendChild(noResultsMessage);
    } else {
        // Display the suggestions
        filteredSuggestions.forEach(user => {
            const suggestion = document.createElement("div");
            suggestion.textContent = user.name + " (" + user.country + ")";
            suggestion.addEventListener("click", function() {
                searchUniName.value = user.name; // Set the input field value to the selected suggestion
                searchSuggestionUniName.innerHTML = ""; // Clear the suggestion list
            });
            searchSuggestionUniName.appendChild(suggestion);
        });
    }
});

searchCountryName.addEventListener("input", function () {
    const userInput = searchCountryName.value.toLowerCase();

    // Clear the suggestion list
    searchSuggestionCountryName.innerHTML = "";

    // Filter and display suggestions based on user input
    const filteredSuggestions = content.filter(user => {
        return user.country.toLowerCase().includes(userInput);
    });
    console.log(filteredSuggestions);

    // Display the suggestions or "No results found" message
    if (filteredSuggestions.length === 0) {
        const noResultsMessage = document.createElement("div");
        noResultsMessage.textContent = "No results found";
        searchSuggestionCountryName.appendChild(noResultsMessage);
    } else {
        filteredSuggestions.forEach(user => {
            const suggestion = document.createElement("div");
            suggestion.textContent = user.name + " (" + user.country + ")";
            suggestion.addEventListener("click", function() {
                searchCountryName.value = user.name; // Set the input field value to the selected suggestion
                searchSuggestionCountryName.innerHTML = ""; // Clear the suggestion list
            });
            searchSuggestionCountryName.appendChild(suggestion);
        });
    }
});

document.addEventListener("click", function (event) {
    const isClickInsideSearchBar = searchUniName.contains(event.target);
    const isClickInsideSuggestionDiv = searchSuggestionUniName.contains(event.target);
  
    if (!isClickInsideSearchBar && !isClickInsideSuggestionDiv) {
      // Clicked outside both search bar and suggestion div, so hide the suggestion div
      searchSuggestionUniName.innerHTML = "";
    }
  });

  document.addEventListener("click", function (event) {
    const isClickInsideSearchBarC = searchCountryName.contains(event.target);
    const isClickInsideSuggestionDivC = searchSuggestionCountryName.contains(event.target);
  
    if (!isClickInsideSearchBarC && !isClickInsideSuggestionDivC) {
      // Clicked outside both search bar and suggestion div, so hide the suggestion div
      searchSuggestionCountryName.innerHTML = "";
    }
  });