
function getAllUniversities() {
    axios.get('http://universities.hipolabs.com/search', {
        params: {
            
        }
    })
    .then(response => {
        for (let university of response.data) {
            console.log(university);
            // elements of row data and card
            let album = document.createElement('div');
            let container = document.createElement('div'); 
            let cardRow = document.createElement('div');
            let individualCol = document.createElement('div');
            let individualCard = document.createElement('div');
            let uniPhoto = document.createElement('svg'); 
            let cardBody = document.createElement('div');
            let cardContent = document.createElement('p'); 
            let viewCol = document.createElement('div');
            let viewButton = document.createElement('div');
            let view = document.createElement('button');


            // text nodes
            let tnUniName = document.createTextNode(university.name);

            // setting card classes
            album.setAttribute('class', 'album py-5 bg-light');
            container.setAttribute('class', 'container');
            cardRow.setAttribute('class', 'row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3');
            individualCol.setAttribute('class', 'col');
            individualCard.setAttribute('class', 'card shadow-sm')
            uniPhoto.setAttribute('class', 'bd-placeholder-img card-img-top');
            cardBody.setAttribute('class', 'card-body');
            cardContent.setAttribute('class', 'card-title');
            viewCol.setAttribute('class', 'd-flex justify-content-between align-items-center');
            viewButton.setAttribute('class', 'btn-group');
            view.setAttribute('class', 'btn btn-sm btn-outline-secondary');


            // a.setAttribute('href', university.webpages[0]);

            // appending children
            view.appendChild(viewButton);
            viewButton.append(viewCol);
            viewCol.appendChild(cardContent);
            cardContent.appendChild(tnUniName);
            uniPhoto.appendChild(individualCard);
            individualCard.appendChild(individualCol);
            individualCol.appendChild(cardRow);
            cardRow.appendChild(container);
            container.appendChild(album);
        }

        // <tr>
        //     <td>
                
        //          <!-- BS card: Start --> 
        //          <div class="card" style="width: 18rem;"> 
        //              <img src="..." class="card-img-top" alt="..."> 
        //              <div class="card-body"> 
        //                  <h5 class="card-title">Card title</h5> 
        //                  <p class="card-text">Some quick example text to make up the bulk of the card's content.</p>  
        //              </div> 
        //              <ul class="list-group list-group-flush"> 
        //                  <li class="list-group-item">An item</li> 
        //                  <li class="list-group-item">A second item</li> 
        //                  <li class="list-group-item">A third item</li> 
        //              </ul> 
        //              <div class="card-body"> 
        //                  <a href="#" class="card-link">Card link</a> 
        //                  <a href="#" class="card-link">Another link</a> 
        //              </div> 
        //          </div> 
        //          <!-- BS card: End --> 
                
        //     </td>
        // </tr>
    })
    .catch( error => {
        console.log(error.message);
    });
}

getAllUniversities()