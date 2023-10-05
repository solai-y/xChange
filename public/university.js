function getAllUniversities() {
    axios.get('./universities', {
        params: {
            
        }
    })
    .then(response => {
        for (let university of response.data) {
            // elements of row data and card
            let individualCard = document.createElement('div');
            let uniPhoto = document.createElement('svg');
            let cardContent = document.createElement('div');
            let uniName = document.createElement('p');
            let viewSection = document.createElement('div');
            let viewButton = document.createElement('div');
            let viewName = document.createElement('button');
            


            // text nodes
            let tnUniName = document.createTextNode(doc.name);
            let btnName = document.createTextNode('Explore');
            // setting card classes
            individualCard.setAttribute('class', 'card shadow-sm');
            uniPhoto.setAttribute('class', 'bd-placeholder-img card-img-top');
            cardContent.setAttribute('class', 'card-body');
            uniName.setAttribute('class', 'card-title');
            viewSection.setAttribute('class', 'd-flex justify-content-between align-items-center');
            viewButton.setAttribute('class', 'btn-group');
            viewName.setAttribute('class', 'btn btn-sm btn-outline-secondary');
            
            // a.setAttribute('href', university.webpages[0]);

            // appending children
            uniName.appendChild(tnUniName);
            cardContent.appendChild(uniName);
            individualCard.appendChild(cardContent);
            individualCard.appendChild(uniPhoto);
            viewName.appendChild(btnName);
            viewButton.appendChild(viewName);
            viewSection.appendChild(viewButton);
            cardContent.appendChild(viewSection);
            


            document.getElementById('uniResults').appendChild(individualCard)

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

    uniCollection.limit(5).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            console.log(doc.data());
            // doc.data() contains the data for each document in the collection
            let individualCard = document.createElement('div');
            let uniPhoto = document.createElement('svg');
            let cardContent = document.createElement('div');
            let uniName = document.createElement('p');
            let viewSection = document.createElement('div');
            let viewButton = document.createElement('div');
            let viewName = document.createElement('button');
            


            // text nodes
            let tnUniName = document.createTextNode(doc.data().name);
            let btnName = document.createTextNode('Explore');
            // setting card classes
            individualCard.setAttribute('class', 'card shadow-sm');
            uniPhoto.setAttribute('class', 'bd-placeholder-img card-img-top');
            cardContent.setAttribute('class', 'card-body');
            uniName.setAttribute('class', 'card-title');
            viewSection.setAttribute('class', 'd-flex justify-content-between align-items-center');
            viewButton.setAttribute('class', 'btn-group');
            viewName.setAttribute('class', 'btn btn-sm btn-outline-secondary');
            
            // a.setAttribute('href', university.webpages[0]);

            // appending children
            uniName.appendChild(tnUniName);
            cardContent.appendChild(uniName);
            individualCard.appendChild(cardContent);
            individualCard.appendChild(uniPhoto);
            viewName.appendChild(btnName);
            viewButton.appendChild(viewName);
            viewSection.appendChild(viewButton);
            cardContent.appendChild(viewSection);
            


            document.getElementById('uniResults').appendChild(individualCard)
        });
    }).catch(function (error) {
        console.error("Error getting documents:", error);
    });
}

document.addEventListener("DOMContentLoaded", event => {
    getAllUniversitiesFirebase();
});

console.log(localStorage.getItem("email"));