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
  modal.style.display = "flex";
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
              $('#add-post-modal').modal('hide');
              location.reload();
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
      let numberOfFields = Object.keys(data).length;
      var noOfReply = parseInt(numberOfFields) - 4
      var postElements = document.createElement("div");
      var time = data.timestamp.toDate();
      const formattedDate = time.toLocaleDateString('en-Sg',{day: 'numeric',month: 'short'}); 
      const formattedTime = time.toLocaleTimeString('en-Sg',{hour:'2-digit',minute:'2-digit'}); 
      postElements.innerHTML = postElements.innerHTML = `
        <div class="post-content" onclick="goComment('${forum_name}')">
        <img src = "${data.picture}" id= "userimage" "> ${data.user}
          <h2 id =forumName>#${forum_name}</h2>
          <p>${data.description}</p>
          <div class = "post-details">
            <div class = "post-date-time">${formattedDate} ${formattedTime} </div>
            <div class =  "replies">${noOfReply} replies </div>
          </div>
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
    var time = data.timestamp.toDate();
    const formattedDate = time.toLocaleDateString('en-Sg',{day: 'numeric',month: 'short'}); 
    const formattedTime = time.toLocaleTimeString('en-Sg',{hour:'2-digit',minute:'2-digit'}); 
    var postElements = document.createElement("div");
    postElements.innerHTML = postElements.innerHTML = `
        <div class="post-content">
        <img src = "${data.picture}" id= "userimage" "> ${data.user}
          <h2 id =forumName>#${post_I_replyingto}</h2>
          <p>${data.description}</p>
          <div class = "post-details">
            <div class = "post-date-time">${formattedDate} ${formattedTime} </div>
          </div>
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
            const userdata = doc.data()
            var user_pic = userdata.image_url || "/images/profile photo.jpeg";
            var fname = userdata.name
            //store it in database
            const forumRef = db.collection("post").doc(post_I_replyingto);
            // call the addComment function with a null parentCommentId for top-level comments
            forumRef.get().then((doc) => {
              var currentTime = new Date()
              let dataSize = Object.keys(doc.data()).length;
              var reply = "reply" +dataSize
              const data = doc.data();
              var data_to_insert = {}
              data_to_insert[reply] = {
                reply: commentContent,
                picture: user_pic,
                user: fname,
                timestamp:firebase.firestore.FieldValue.serverTimestamp(),
              };
              forumRef.update(data_to_insert).then(() => {
                console.log("Reply added to the post.");
                const comment_cont = document.getElementById("comments-container");
                const formattedDate = currentTime.toLocaleDateString('en-Sg',{day: 'numeric',month: 'short'}); 
                const formattedTime = currentTime.toLocaleTimeString('en-Sg',{hour:'2-digit',minute:'2-digit'});
                var commentElements = document.createElement("div");
                  commentElements.innerHTML = commentElements.innerHTML = `
                    <div class="comment-content" id="${postId}">
                    <img src = "${user_pic}" id= "userimage" "> ${fname}
                      <p>${commentContent}</p>
                      <div class = "post-details">
                      <div class = "post-date-time">${formattedDate} ${formattedTime} </div>
                      </div>
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
    var time = data[reply].timestamp.toDate();
    const formattedDate = time.toLocaleDateString('en-Sg',{day: 'numeric',month: 'short'}); 
    const formattedTime = time.toLocaleTimeString('en-Sg',{hour:'2-digit',minute:'2-digit'});
    var postReply = document.createElement("div");
    postReply.innerHTML= `
        <div class="reply-content" id="${reply}">
          <img src = "${data[reply].picture}" id= "userimage" "> ${data[reply].user}
          <p>${data[reply].reply}</p>
          <div class = "post-details">
          <div class = "post-date-time">${formattedDate} ${formattedTime} </div>
          </div>
        </div>
      `;
    var replyContainer = document.getElementById("comments-container");
    replyContainer.appendChild(postReply);
    }
  })
}

function goback(){
  window.location.href = "forum.html";
}