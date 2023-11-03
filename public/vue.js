// VUE
// Import necessary Vue Composition API functions
import {
  createApp,
  ref,
  watch,
} from "https://cdn.jsdelivr.net/npm/vue@3.2.6/dist/vue.esm-browser.js";

// VUE
var aboutVue = ref("Loading...");
var universityVue = ref("University");
var gpaVue = ref("X.X");
var backgroundImageVue = ref("bgimage");
var aboutImageVue = ref("abtimage");
var modulesVue = ref("basket");
var galleryVue = ref("gallery");
var uidVue = JSON.parse(sessionStorage.getItem("user"));
if (uidVue != null){
  var userVue = uidVue.uid;
}
var reviewVue = ref("review");
var docIdVue = ref("temp");
var comment = document.getElementById("comment");
var username = ref("name");
var image_url = ref("image");
var bgImage = ref("../images/universityCourtyard.jpg");

const app = createApp({
  data() {
    return {
      aboutVue: aboutVue.value,
      universityVue: universityVue.value,
      gpaVue: gpaVue.value,
      backgroundImageVue: backgroundImageVue.value,
      aboutImageVue: aboutImageVue.value,
      modulesVue: modulesVue.value,
      selectedModule: "Managing",
      galleryVue: galleryVue.value,
      userVue: userVue,
      reviewVue: reviewVue.value,
      docIdVue: docIdVue.value,
      comment: comment.value,
      username: username.value,
      image_url: image_url.value,
      usernameComment: "",
      imageComment: "",
      bgImage: bgImage.value,
    };
  },
  methods: {
    reviewForm: function () {
      var popup = document.getElementById("reviewPopup");
      
      popup.style.display = "block";
    },
    universityURL(){
      return "https://www.google.com/maps/embed/v1/search?key={API-KEY}&q="+ this.universityVue + "&zoom=15&maptype=satellite";
    },

    closePopup: function () {
      var popup = document.getElementById("reviewPopup");
      popup.style.display = "none";
    },

    submitReview: function () {
      var userData = db.collection("Users").doc(this.userVue);
      const vueInstance = this;
    
      userData.get().then(function (doc) {
        let userInfo = doc.data();

        if (userInfo) {
          vueInstance.usernameComment = userInfo["name"];
    
          if (userInfo.image_url) {
            vueInstance.imageComment = userInfo.image_url;
          } else {
            vueInstance.imageComment = "./images/profile photo.jpeg";
          }

          if (Array.isArray(vueInstance.reviewVue)) {
            vueInstance.reviewVue.push({"comment": vueInstance.comment, "username": vueInstance.usernameComment, "image_url": vueInstance.imageComment});
          } else {
            vueInstance.reviewVue = {"comment": vueInstance.comment, "username": vueInstance.usernameComment, "image_url": vueInstance.imageComment};
          }
          // Update the database here, inside the callback
          db.collection("University")
            .doc(vueInstance.docIdVue)
            .update({
              review: firebase.firestore.FieldValue.arrayUnion({
                username: vueInstance.usernameComment,
                image_url: vueInstance.imageComment,
                comment: vueInstance.comment,
              }),
            });
    
          // Clear form inputs
          vueInstance.comment = "";
    
          // Hide the form after submission
          vueInstance.closePopup();
        }
      });
    },
      
    methodName() {
      // Your method logic here

    },

    fetchData() {
      document.addEventListener("DOMContentLoaded", (event) => {
        //retrieve get value
        const url = window.location.search;
        const docId = url.split("=")[1];

        // console.log(docId);

        // retrieve data from firebase
        if (typeof app == "undefined") {
          const app = firebase.initializeApp(firebaseConfig);
        }

        // prints the firebase connection to check for bug
        // console.log(app);

        // check for db existence
        if (typeof db == "undefined") {
          db = firebase.firestore();
          auth = firebase.auth();
        }

        
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
        fixJavansProblems();

        // use get params to retrieve single data point form firestore
        var userCollection = db.collection("University").doc(docId);

        console.log(userCollection);

        // Capture the 'this' context
        const vueInstance = this;

        userCollection
          .get()
          .then((doc) => {
            var info = doc.data();
            console.log("info:", info);
            this.aboutVue = info.about;
            this.universityVue = info.name;
            this.gpaVue = info.gpa;
            this.backgroundImageVue = info.gallery[0];
            this.aboutImageVue = info.gallery[1];
            this.modulesVue = info.modules;
            this.galleryVue = info.gallery;
            this.reviewVue = info.review;
            this.docIdVue = docId;
            this.bgImage = info.gallery[0];
            document.getElementById("universityHome").style.backgroundImage=`url(${this.bgImage})`
          })
          .catch(function (error) {
            console.error("Error updating document: ", error);
            // Handle the error, e.g., show an error message
          });
      });
    },
  },

  mounted() {
    this.fetchData();
  },
});

// Create a watcher to update the 'about' value when it changes
watch(aboutVue, (newValue) => {
  app.config.globalProperties.aboutVue = newValue;
});
// component must be declared before app.mount(...)

const vm = app.mount("#app");

