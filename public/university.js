
function getAllUniversities() {
    axios.get('http://universities.hipolabs.com/search', {
        params: {
            
        }
    })
    .then(response => {
        for (let university of response.data) {
            console.log(university);
            let tr = document.createElement('tr');
            let a = document.createElement('a');
            // a.setAttribute('href', university.webpages[0]);
            let p = document.createElement('p');
            let tnP = document.createTextNode(university.name, university.country);
            p.appendChild(tnP);
            a.appendChild(p);
            tr.appendChild(a);
            document.getElementById('UniversityList').appendChild(tr);
        }
    })
    .catch( error => {
        console.log(error.message);
    });
}

getAllUniversities()