
// VUE
// Import necessary Vue Composition API functions
import { createApp, ref, watch } from 'https://cdn.jsdelivr.net/npm/vue@3.2.6/dist/vue.esm-browser.js';

// VUE
var aboutVue = ref('Loading...');
var universityVue = ref('University');
var gpaVue = ref('X.X');

const app = createApp({
    data() {
        return { 
            aboutVue: aboutVue.value,
            universityVue: universityVue.value,
            gpaVue: gpaVue.value,
        };
    },
    methods: {
        methodName() {
            // Your method logic here
        },
        fetchData() {
            document.addEventListener("DOMContentLoaded", event => {
                //retrieve get value
                let url = window.location.search;
                let docId = url.split("=")[1];
                // console.log(docId);
            
                // retrieve data from firebase
                if (typeof app == 'undefined') {
                    const app = firebase.initializeApp(firebaseConfig);
                }
            
                // prints the firebase connection to check for bug
                // console.log(app);
            
                // check for db existence
                if (typeof db== 'undefined') {
                    db = firebase.firestore();
                    auth = firebase.auth();
                }
            
                // use get params to retrieve single data point form firestore
                var userCollection = db.collection("University").doc(docId);
                console.log(userCollection);

                // Capture the 'this' context
                const vueInstance = this;


                userCollection.get().then((doc) => {
                    var info = doc.data();
                    console.log("info:", info);
                    this.aboutVue = info.about;
                    this.universityVue = info.name;
                    this.gpaVue = info.gpa;
                })
                .catch(function(error) {
                    console.error("Error updating document: ", error);
                    // Handle the error, e.g., show an error message
                });
            });
        }
    }, 
    mounted() {
        this.fetchData();
    },
});

// Create a watcher to update the 'about' value when it changes
watch(aboutVue, (newValue) => {
    app.config.globalProperties.aboutVue = newValue;
});



const vm = app.mount('#app'); 

