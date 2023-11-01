const firebaseConfig = {
  apiKey: "AIzaSyA7ogQ3Eqn-tu_2NYnzHfo-ARsYwR5hSKg",
  authDomain: "xchange-2af7e.firebaseapp.com",
  projectId: "xchange-2af7e",
  storageBucket: "xchange-2af7e.appspot.com",
  messagingSenderId: "663333771385",
  appId: "1:663333771385:web:a0c12e9499e1d78e7adca8",
  measurementId: "G-94L4SG8ZW0",
};
document.addEventListener("DOMContentLoaded", (event) => {
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
  showing_post();
  post_to_load();
  load_reply_post();
  
});
// For the modal to show up
const addPostButton = document.querySelector("#show-add-post-modal-btn");
const modal = document.querySelector("#add-post-modal");
const closeBtn = document.querySelector("#close-modal-btn");
addPostButton.addEventListener("click", function (event) {
  event.preventDefault();
  modal.style.display = "block";
});
closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

function new_forum(event) {
  // event.preventDefault();
  const docRef = db.collection("Users");
  //getting the user from the sessionStorage
  var user = sessionStorage.getItem("user");
  var userObject = JSON.parse(user);
  var uid = userObject.uid;
  docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      //getting the user UID in the USER DOCUMENT
      var docId = doc.id;
      //Checking if the document ID has this UID
      if (docId == uid) {
        const userRef = db.collection("Users").doc(uid);
        userRef.get().then((doc) => {
          //if this document exits
          if (doc.exists) {
            // we take the name
            var first_name = doc.data().name || "randomUser";
            //we take the image
            var image_url =
              doc.data().image_url || "./images/profile photo.jpeg";
          }
          var title = document.getElementById("title").value;
          var content = document.getElementById("content").value;
          //message ref
          document.getElementById("title").value = "";
          document.getElementById("content").value = "";
          //refer the database
          const postRef = db.collection("post");
          //object
          var data_to_insert = {};
          data_to_insert = {
            description: content,
            user: first_name,
            picture: image_url,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          };
          postRef
            .doc(title)
            .set(data_to_insert)
            .then(() => {
              console.log("data is inside");
              $('#add-pst-modal').modal('hide');
            });
        });
      }
    });
  });
}

function showing_post() {
  //database
  const forumRef = db.collection("post");
  forumRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      const data = doc.data();
      var forum_name = doc.id;
      var postElements = document.createElement("div");
      postElements.innerHTML = postElements.innerHTML = `
        <div class="post-content" onclick="goComment('${forum_name}')">
          <h2 id =forumName>#${forum_name}</h2>
          <p>${data.description}</p>
        </div>
      `;
      const postContainer = document.getElementById("posts-container"); // Replace with the actual container element ID
      postContainer.appendChild(postElements);
    });
  });
}
function goComment(element) {
  window.location.href = "reply.html";
  localStorage.setItem("postId", element); 
}
//for comment
function post_to_load() {
  var post_I_replyingto = localStorage.getItem("postId");
  const forumRef = db.collection("post").doc(post_I_replyingto);
  forumRef.get().then((doc) => {
    const data = doc.data();
    var postElements = document.createElement("div");
    postElements.innerHTML = postElements.innerHTML = `
        <div class="post-content">
          <h2 id =forumName>#${post_I_replyingto}</h2>
          <p>${data.description}</p>
        </div>
      `;
    const replyContainer = document.getElementById("post-detail");
    replyContainer.appendChild(postElements);
  });
}


function handleAddCommentFormSubmit() {
  
  var user = sessionStorage.getItem("user");
  var userObject = JSON.parse(user);
  var uid = userObject.uid;
  const docRef = db.collection("Users");
  docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      //getting the user UID in the USER DOCUMENT
      var docId = doc.id;
      //Checking if the document ID has this UID
      if (docId == uid) {
        const userRef = db.collection("Users").doc(uid);
        userRef.get().then((doc) => {
          //if this document exits
          if (doc.exists) {
            // we take the name
            var post_I_replyingto = localStorage.getItem("postId");
            const commentTextarea = document.getElementById("comment");
            const commentContent = commentTextarea.value;
            
            //store it in database
            const forumRef = db.collection("post").doc(post_I_replyingto);
            // call the addComment function with a null parentCommentId for top-level comments
            forumRef.get().then((doc) => {
              let dataSize = Object.keys(doc.data()).length;
              var reply = "reply" +dataSize
              const data = doc.data();
              var data_to_insert = {}
              data_to_insert[reply] = {
                reply: commentContent,
                picture: data.picture,
                timestamp: data.timestamp,
                user: data.user,
                timestamp:firebase.firestore.FieldValue.serverTimestamp(),
              };
              forumRef.update(data_to_insert).then(() => {
                console.log("Reply added to the post.");
                const comment_cont = document.getElementById("comments-container");
                var commentElements = document.createElement("div");
                  commentElements.innerHTML = commentElements.innerHTML = `
                    <div class="comment-content">
                      <h2 id =${reply}>${data.user}</h2>
                      <p>${commentContent}</p>
                    </div>`
                comment_cont.appendChild(commentElements)
                commentTextarea.value ="";
              });
            });
          }
        });
      }
    });
  });
}

function load_reply_post(){
  var postId = localStorage.getItem("postId");
  const forumRef = db.collection("post").doc(postId);
  
  forumRef.get().then((doc) => {
    const data = doc.data();
    var dataSize = Object.keys(doc.data()).length;
    for(i=4; i <= dataSize; i++){
    var reply = "reply" +i
    console.log(reply)
    console.log(data[reply])
    var postReply = document.createElement("div");
    postReply.innerHTML= `
        <div class="reply-content">
          <h2 id =replyName>#${data[reply].user}</h2>
          <p>${data[reply].reply}</p>
        </div>
      `;
    var replyContainer = document.getElementById("comments-container");
    replyContainer.appendChild(postReply);
    }
  })
}
