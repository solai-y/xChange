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
    console.log(app);
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
      };
    }, 
    methods: {
      btnSearchClick() {
        this.search = true
        console.log(this.selectedModuleNames)
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
        console.log(this.filteredUniList)
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
        console.log("list",listToBeReturned);
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
          console.log('Retrieved data:', data);
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
