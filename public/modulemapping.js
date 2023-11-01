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
    console.log(uniSearchValue, unis)
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
