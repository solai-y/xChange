const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req, res) => {
  // Set up a rule to proxy requests to the HTTP API
  if (req.url.startsWith('/universities')) {
    // Make an Axios request to the external API
    axios.get('http://universities.hipolabs.com/search' + req.url)
      .then(apiResponse => {
        // Forward the API response to the client
        res.writeHead(apiResponse.status, apiResponse.headers);
        res.end(apiResponse.data);
      })
      .catch(error => {
        // Handle Axios or API request errors
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      });
  } else {
    // Handle other requests as needed
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!\n');
  }
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

function getAllUniversities() {
    axios.get('./universities', {
        params: {
            
        }
    })
    .then(response => {
        for (let university of response.data) {
            console.log(university);
            // elements of row data and card
            let individualCard = document.createElement('div');
            let uniPhoto = document.createElement('svg');
            let cardContent = document.createElement('div');
            let uniName = document.createElement('p');
            let viewSection = document.createElement('div');
            let viewButton = document.createElement('div');
            let viewName = document.createElement('button');
            


            // text nodes
            let tnUniName = document.createTextNode(university.name, university.country);
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