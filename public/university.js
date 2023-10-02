
function getAllUniversities() {
    axios.get('http://universities.hipolabs.com/search', {
        params: {
            
        }
    })
    .then(response => {
        for (let university of response.data) {
            // elements of row data and card
            let tr = document.createElement('tr'); // not sure if we want to use table formatting?
            let td = document.createElement('td');
            let cardDiv = document.createElement('div');// main card div
            let cardBody = document.createElement('div');// card body div
            let a = document.createElement('a'); // should set up link to the uni page (in our website) here 
            let uniName = document.createElement('h5');// card title

            // text nodes
            let tnUniName = document.createTextNode(university.name, university.country);

            // setting card classes
            cardDiv.setAttribute('class', 'card');
            cardBody.setAttribute('class', 'card-body');
            uniName.setAttribute('class', 'card-title');
            // a.setAttribute('href', university.webpages[0]);

            // appending children
            uniName.appendChild(tnUniName);
            cardBody.appendChild(uniName);
            cardDiv.appendChild(cardBody);
            td.appendChild(cardDiv);
            a.appendChild(td);
            tr.appendChild(a);
            document.getElementById('UniversityList').appendChild(tr);
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