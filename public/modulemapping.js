// const firebaseConfig = {
//   apiKey: "AIzaSyA7ogQ3Eqn-tu_2NYnzHfo-ARsYwR5hSKg",
//   authDomain: "xchange-2af7e.firebaseapp.com",
//   projectId: "xchange-2af7e",
//   storageBucket: "xchange-2af7e.appspot.com",
//   messagingSenderId: "663333771385",
//   appId: "1:663333771385:web:a0c12e9499e1d78e7adca8",
//   measurementId: "G-94L4SG8ZW0",
// };


// <div id='app'></div>


document.addEventListener('DOMContentLoaded',  (event) => {
  if (typeof app == "undefined") {
    const app = firebase.initializeApp(firebaseConfig);
  }
  
  // prints the firebase connection to check for bug
  // console.log(app);x
  if (typeof db == "undefined") {
    db = firebase.firestore();
    auth = firebase.auth();
  }
  // call functions
  const appVue = Vue.createApp({ 
    data() { 
      return { 
        btnSearch: "",  // key: value
        uniList: [],
        selectedModuleNames:[],
        filteredUniList: [],
        search: false,
        btnSearch: "", 
        btnSearchCountry: "",
      };
    }, 
    methods: {
      btnEditSearch() {
        this.search = false;
      },  
      btnSearchClick() {
        this.filteredUniList = [];
        this.search = true
        this.uniList.forEach((info)=>{
          let uniState = true;
          this.selectedModuleNames.forEach((moduleName)=> {
            if (moduleName in info[0]) {

            } else {
              uniState = false;
            }
          })
          if (uniState){
            this.filteredUniList.push(info);
          }
        })
      },
      toggleCheckbox(module) {
        const backendName = this.moduleList[module];
        if (this.selectedModuleNames.includes(backendName)) {
          this.selectedModuleNames = this.selectedModuleNames.filter(name => name !== backendName);
        } else {
          this.selectedModuleNames.push(backendName);
        }
      }, 
      shouldShowUni(uni) {
        const uniSearchValue = this.btnSearch.toLowerCase();
        const countrySearchValue = this.btnSearchCountry.toLowerCase();
    
        // Check if the university name or country matches the search criteria
        const nameMatches = uni[0].name.toLowerCase().includes(uniSearchValue);
        const countryMatches = uni[0].country.toLowerCase().includes(countrySearchValue);
    
        // Return true if either the name or country matches the search criteria
        return nameMatches && countryMatches;
      }
    }, 
    computed: {
      moduleList() {
        const listToBeReturned = {};
        this.uniList.forEach((info) => {
          // Step 3: Extract and check module properties
          for (let key in info[0]) {
            // Check if the property starts with 'module_' to identify module-related properties
            if (key.startsWith('module_')) {
              let moduleName = key.slice(7); // Extract the module name (remove 'module_')
              let words = moduleName.split(/(?=[A-Z])/); // Split at uppercase letters
              let formattedModuleName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); // Capitalize the first letter of each word
              
              // Step 4: Add to the uniqueModules array if not already present
              if (key in listToBeReturned) {
                
              } else {
                listToBeReturned[key] = formattedModuleName;
              }
            }
          }
        });
        return listToBeReturned;
      }
    },  
    created() {
      // This is where you can fetch data from Firebase Firestore
      const vueInstance = this; // Capture the 'this' context
  
      // Example: Fetch a collection from Firebase and store it in myList
      db.collection('University')
        .get()
        .then((querySnapshot) => {
          const data = [];
          querySnapshot.forEach((doc) => {
            // Process each document in the collection
            data.push(
              [doc.data(), doc.id]
            );
          });
          vueInstance.uniList = data; // Update myList with the retrieved data
        })
        .catch((error) => {
          console.error('Error fetching data: ', error);
          // Handle the error, e.g., show an error message
        });
    },
  });
  const vm = appVue.mount('#appVue'); 

});


//search processing
const searchUniName = document.querySelector("[data-search-uni-name]");
const searchCountryName = document.querySelector("[data-search-country-name]");

searchUniName.addEventListener("input", (e) => {
    let uniSearchValue = e.target.value.toLowerCase();
    let unis = document.getElementsByClassName("uniName");
    // console.log(uniSearchValue);
    unis.forEach(uni => {
        let isVisible = user.name.toLowerCase().includes(uniSearchValue)
        uni.element.classList.toggle("hide", !isVisible);
    });
});
searchCountryName.addEventListener("input", (e) => {
    let countrySearchValue = e.target.value.toLowerCase();
    let unis = document.getElementsByClassName("uniName")
    // console.log(uniSearchValue);
    unis.forEach(uni => {
        let isVisible = user.country.toLowerCase().includes(countrySearchValue)
        uni.element.classList.toggle("hide", !isVisible);
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
  console.log(filteredSuggestions);
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
  fixJavansProblems();
});
