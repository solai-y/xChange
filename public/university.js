



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

document.addEventListener("DOMContentLoaded", event => {
    getAllUniversitiesFirebase();
});


//search processing
const searchUniName = document.querySelector("[data-search-uni-name]");
const searchCountryName = document.querySelector("[data-search-country-name]");

searchUniName.addEventListener("input", (e) => {
    let uniSearchValue = e.target.value.toLowerCase();
    // console.log(uniSearchValue);
    content.forEach(user => {
        let isVisible = user.name.toLowerCase().includes(uniSearchValue)
        user.element.classList.toggle("hide", !isVisible);
    });
});
searchCountryName.addEventListener("input", (e) => {
    let countrySearchValue = e.target.value.toLowerCase();
    // console.log(uniSearchValue);
    content.forEach(user => {
        let isVisible = user.country.toLowerCase().includes(countrySearchValue)
        user.element.classList.toggle("hide", !isVisible);
    });
});



console.log(localStorage.getItem("email"));