const user_session = sessionStorage.getItem("user");

const firebaseConfig = {
  apiKey: "AIzaSyA7ogQ3Eqn-tu_2NYnzHfo-ARsYwR5hSKg",
  authDomain: "xchange-2af7e.firebaseapp.com",
  projectId: "xchange-2af7e",
  storageBucket: "xchange-2af7e.appspot.com",
  messagingSenderId: "663333771385",
  appId: "1:663333771385:web:a0c12e9499e1d78e7adca8",
  measurementId: "G-94L4SG8ZW0"
};
document.addEventListener("DOMContentLoaded", event => {
  if (typeof app == 'undefined') {
    const app = firebase.initializeApp(firebaseConfig);
  }

  // prints the firebase connection to check for bug
  // console.log(app);
  if (typeof db== 'undefined') {
    db = firebase.firestore();
    auth = firebase.auth();
  }
});

function addNewForum(){
  var forum = document.getElementById("newForumName").value;
  if(forum != ""){
    data_to_insert = {
      chat1: forum,
    }
    db.collection('forum').doc(forum).set(data_to_insert)
    .then(() =>{
      console.log("data is inside");
    }).catch((error)=>{
      console.error("sth wrong",error);
    });
    docRef = db.collection("forum").doc(forum);
    if(docRef){
      docRef.get().then((doc)=>{
        if(doc.exists){
          console.log("Document data:", doc.data());
        var createElement = document.createElement("div");
        createElement.setAttribute("class","new_forum");
        createElement.setAttribute("id",forum);
        var node = document.createTextNode("#"+forum);
        createElement.appendChild(node);
        var forumListDiv = document.querySelector(".forum-list");
        forumListDiv.appendChild(createElement);
      };

        })
      }
    }document.getElementById("newForumName").value = "";


  }
  function loadChatForums() {
    db.collection("forum").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Retrieve each chat forum from Firestore and create the corresponding element
        createChatForumElement(doc.id);
      });
    }).catch((error) => {
      console.error("Error loading chat forums:", error);
    });
  }
  window.onload = loadChatForums;
function newchat(){
  var cur_page = document.getElementsByClassName("new_forum")[0];
  var indv_forum = cur_page.getAttribute('id');
  const docRef = db.collection("forum").doc(indv_forum)
  if (docRef){
      docRef.get().then((doc) => {
    if (doc.exists) {
      // Document data is in doc.data()
      console.log("Document data:", doc.data());
      var insert_post = document.querySelector(".post_headerDescription");
      var createElement = document.createElement("p");
      var things = doc.data();
      var text =document.createTextNode( things["chat2"]);
      createElement.appendChild(text);
      insert_post.appendChild(createElement);
      const pickRef = db.collection("Users").doc("neQ9uYDljMM5HIjR8mGoKziPNTo2");
      pickRef.get().then((doc) =>{
      if (doc.exists){
          console.log("Document data:", doc.data());
          var insert_post = document.querySelector(".post_avatar");
          var things = doc.data();
          var imageURL = things["image_url"];
          var imageElement = document.createElement("img");
          imageElement.src = imageURL;
          insert_post.appendChild(imageElement);
          var insert_post = document.querySelector(".user_account");
          var text = things["name"];
          var node_text = document.createTextNode(text);
          insert_post.appendChild(node_text);
        

      }else {
        console.log("No such document!");
      }
    }).catch((error) => {
      console.error("Error getting document:", error);
    });
    }
  })
}
}

function account_load(){
  const docRef = db.collection("Users").doc(data.uid);
  docRef.get().then((doc) => {
    if (doc.exists){
      console.log("Document data:", doc.data());

    }else {
      console.log("No such document!");
    }
  }).catch((error) => {
    console.error("Error getting document:", error);
  });
}