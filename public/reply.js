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

  post_to_load();
  load_reply_post();
});

function post_to_load() {
  var post_I_replyingto = localStorage.getItem("postId");
  const forumRef = db.collection("post").doc(post_I_replyingto);
  forumRef.get().then((doc) => {
    const data = doc.data();
    var time = data.timestamp.toDate();
    const formattedDate = time.toLocaleDateString("en-Sg", {
      day: "numeric",
      month: "short",
    });
    const formattedTime = time.toLocaleTimeString("en-Sg", {
      hour: "2-digit",
      minute: "2-digit",
    });
    var postElements = document.createElement("div");
    postElements.innerHTML = `
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
  var postId = localStorage.getItem("postId");
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
            const userdata = doc.data();
            var user_pic = userdata.image_url || "/images/profile photo.jpeg";
            var fname = userdata.name;
            //store it in database
            const forumRef = db.collection("post").doc(post_I_replyingto);
            // call the addComment function with a null parentCommentId for top-level comments
            forumRef.get().then((doc) => {
              var currentTime = new Date();
              let dataSize = Object.keys(doc.data()).length;
              var reply = "reply" + dataSize;
              const data = doc.data();
              var data_to_insert = {};
              data_to_insert[reply] = {
                reply: commentContent,
                picture: user_pic,
                user: fname,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              };
              forumRef.update(data_to_insert).then(() => {
                console.log("Reply added to the post.");
                const comment_cont =
                  document.getElementById("comments-container");
                const formattedDate = currentTime.toLocaleDateString("en-Sg", {
                  day: "numeric",
                  month: "short",
                });
                const formattedTime = currentTime.toLocaleTimeString("en-Sg", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                var commentElements = document.createElement("div");
                commentElements.innerHTML = commentElements.innerHTML = `
                      <div class="comment-content" id="${postId}">
                      <img src = "${user_pic}" id= "userimage" "> ${fname}
                        <p>${commentContent}</p>
                        <div class = "post-details">
                        <div class = "post-date-time">${formattedDate} ${formattedTime} </div>
                        </div>
                      </div>`;
                comment_cont.appendChild(commentElements);
                commentTextarea.value = "";
              });
            });
          }
        });
      }
    });
  });
}

function load_reply_post() {
  var postId = localStorage.getItem("postId");
  const forumRef = db.collection("post").doc(postId);
  forumRef.get().then((doc) => {
    const data = doc.data();
    console.log(data);
    var dataSize = Object.keys(doc.data()).length;
    for (i = 4; i <= 100; i++) {
      var reply = "reply" + i;
      if (data[reply] != undefined) {
        var time = data[reply].timestamp.toDate();
        const formattedDate = time.toLocaleDateString("en-Sg", {
          day: "numeric",
          month: "short",
        });
        const formattedTime = time.toLocaleTimeString("en-Sg", {
          hour: "2-digit",
          minute: "2-digit",
        });
        localStorage.setItem("username", `${data[reply].user}`);
        var postReply = document.createElement("div");
        postReply.innerHTML = `
          <div class="reply-content" style="display:block" id="${reply}" onclick = "showdeletebutton(this.id)">
            <img src = "${data[reply].picture}" id= "userimage" class = "reply_avatar"> ${data[reply].user}
            <p>${data[reply].reply}</p>
            <div class = "post-details">
            <div class = "post-date-time">${formattedDate} ${formattedTime} </div>
            </div>
          </div>
        `;
        var replyContainer = document.getElementById("comments-container");
        replyContainer.appendChild(postReply);
      } else {
        continue;
      }
    }
  });
}

function delete_post(reply) {
  var postDocId = localStorage.getItem("postId");
  const replyRef = db.collection("post").doc(postDocId);
  var bye_reply = document.getElementById(reply);
  bye_reply.style.display = "none";
  const fieldtodelete = {};
  fieldtodelete[reply] = firebase.firestore.FieldValue.delete();
  return replyRef
    .update(fieldtodelete)
    .then(() => {
      console.log(
        `Field '${fieldName}' successfully deleted from the document.`
      );
    })
    .catch((error) => {
      console.error("Error deleting field: ", error);
    });
}

function showdeletebutton(reply) {
  // Check if the delete button is already present
  var deleteBtn = document.getElementById("deletebtn-" + reply);
  var editbutton1 = document.getElementById("editbtn-" + reply);
  var postId = localStorage.getItem("postId");
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
        const data = doc.data();
        var fname = data.name;
        const replyRef = db.collection("post").doc(postId);
        replyRef.get().then((doc) => {
          const data_ref = doc.data();
          var post_name = data_ref[reply].user;
          if (fname == post_name) {
            if (deleteBtn == undefined && editbutton1 == undefined) {
              var editbutton = document.createElement("button");
              editbutton.setAttribute("type", "button");
              editbutton.id = "editbtn-" + reply;
              editbutton.className = "edit-button";
              editbutton.setAttribute("onclick", "edit_post('" + reply + "')");
              editbutton.innerHTML = "Edit";
              var deleteButton = document.createElement("button");
              deleteButton.setAttribute("type", "button");
              deleteButton.id = "deletebtn-" + reply;
              deleteButton.className = "delete-button";
              deleteButton.setAttribute(
                "onclick",
                "delete_post('" + reply + "')"
              );
              deleteButton.innerHTML = "Delete";
              let replyContent = document.getElementById(reply);
              replyContent.appendChild(editbutton);
              replyContent.appendChild(deleteButton);

              // Show the delete button
              deleteButton.style.display = "block";
              // show the edit button
              editbutton.style.display = "block";
            } else {
              // Toggle the visibility of the delete button
              deleteBtn.style.display =
                deleteBtn.style.display === "block" ? "none" : "block";
              editbutton1.style.display =
                editbutton1.style.display === "block" ? "none" : "block";
            }
          } else {
            if (deleteBtn) {
              deleteBtn.style.display = "none";
            }
            if (editbutton1) {
              editbutton1.style.display = "none";
            }
          }
        });
      }
    });
  });
}

function goback() {
  window.location.href = "forum.html";
}

function edit_post(reply) {
  var postId = localStorage.getItem("postId");
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
            const userdata = doc.data();
            var user_pic = userdata.image_url || "/images/profile photo.jpeg";
            var fname = userdata.name;
            //store it in database
            const replyRef = db.collection("post").doc(postId);
            replyRef.get().then((doc) => {
              const data = doc.data();

              // Assuming your post has a "description" field, you can use it here.

              // Display an edit form or modal with the current post content.
              const editedDescription = prompt("Edit your post:");
              var data_to_insert = {};
              data_to_insert = {
                reply: editedDescription,
                picture: user_pic,
                user: fname,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              };
              const forumRef = db.collection("post").doc(postId);
              forumRef.update({
                [reply]: data_to_insert,
              });
              var hidem = document.getElementById(reply);
              hidem.style.display = "none";
              var time = data[reply].timestamp.toDate();
              const formattedDate = time.toLocaleDateString("en-Sg", {
                day: "numeric",
                month: "short",
              });
              const formattedTime = time.toLocaleTimeString("en-Sg", {
                hour: "2-digit",
                minute: "2-digit",
              });
              var postReply = document.createElement("div");
              postReply.innerHTML = `
                  <div class="reply-content" style="display:block" id="${reply}" onclick = "showdeletebutton(this.id)">
                    <img src = "${data[reply].picture}" id= "userimage" class = "reply_avatar"> ${data[reply].user}
                    <p>${editedDescription}</p>
                    <div class = "post-details">
                    <div class = "post-date-time">${formattedDate} ${formattedTime} (editted)</div>
                    </div>
                  </div>
                `;
              var replyContainer =
                document.getElementById("comments-container");
              replyContainer.insertAdjacentElement("beforebegin",postReply);
            });
          }
        });
      }
    });
  });
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
          if (reviewData && reviewData.image_url) {
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
