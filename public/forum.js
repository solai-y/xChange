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
  var storage = firebase.storage();
  var storRef = storage.ref();
  var getImg = document.getElementById("image").files[0];
  var Uploadimg = storRef.put(getImg);
  Uploadimg.on("state_changed", function (snapshot) {
    // Progress monitoring (optional)
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log("Upload is " + progress + "% done");
  });
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
              $("#add-post-modal").modal("hide");
              location.reload();
            });
        });
      }
    });
  });
}
function showing_post() {
  //database
  var post_id = localStorage.getItem("postId");
  const forumRef = db.collection("post");
  forumRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      const data = doc.data();
      var forum_name = doc.id;
      let numberOfFields = Object.keys(data).length;
      var noOfReply = parseInt(numberOfFields) - 4;
      var postElements = document.createElement("div");
      var time = data.timestamp.toDate();
      const formattedDate = time.toLocaleDateString("en-Sg", {
        day: "numeric",
        month: "short",
      });
      const formattedTime = time.toLocaleTimeString("en-Sg", {
        hour: "2-digit",
        minute: "2-digit",
      });
      postElements.innerHTML = `
        <div class="post-content" id = "${forum_name}" onclick="goComment('${forum_name}')">
        <div class ="ellipsis" onmouseover="edit_forum('${forum_name}')"><i class="fa-solid fa-ellipsis"></i>,</div>
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
      // currently this is the filter when it changes
      //first condition
    });
  });

  const filterSelect = document.getElementById("filter-select");
  filterSelect.addEventListener("change", () => {
    const selectedFilter = filterSelect.value;
    const postContainer = document.getElementById("posts-container");
    postContainer.innerHTML = "";
    

    if (selectedFilter == "all") {
      forumRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const data = doc.data();
          var forum_name = doc.id;
          let numberOfFields = Object.keys(data).length;
          var noOfReply = parseInt(numberOfFields) - 4;
          var postElements = document.createElement("div");
          var time = data.timestamp.toDate();
          const formattedDate = time.toLocaleDateString("en-Sg", {
            day: "numeric",
            month: "short",
          });
          const formattedTime = time.toLocaleTimeString("en-Sg", {
            hour: "2-digit",
            minute: "2-digit",
          });
          postElements.innerHTML = `
        <div class="post-content" id = "${forum_name}" onclick="goComment('${forum_name}')">
        <div class ="ellipsis" onmouseover="edit_forum('${forum_name}')"> ><i class="fa-solid fa-ellipsis"></i>,</div>
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
    } else if (selectedFilter == "Most Replied") {
      const sortedPosts = [];
      forumRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          const data = doc.data();
          var forum_name = doc.id;
          let numberOfFields = Object.keys(data).length;
          var noOfReply = parseInt(numberOfFields) - 4;
          // Only include posts with replies (comments)
          if (noOfReply > 0) {
            sortedPosts.push({ forum_name, data, noOfReply });
          }
        });

        // Sort the posts by the number of replies in descending order
        sortedPosts.sort((a, b) => b.noOfReply - a.noOfReply);

        // Display posts based on the selected filter
        sortedPosts.forEach(({ forum_name, data, noOfReply }) => {
          var postElements = document.createElement("div");
          var time = data.timestamp.toDate();
          const formattedDate = time.toLocaleDateString("en-SG", {
            day: "numeric",
            month: "short",
          });
          const formattedTime = time.toLocaleTimeString("en-SG", {
            hour: "2-digit",
            minute: "2-digit",
          });

          postElements.innerHTML = `
        <div class="post-content"id = "${forum_name}"  onclick="goComment('${forum_name}')">
        <div class ="ellipsis" onmouseover="edit_forum('${forum_name}')">><i class="fa-solid fa-ellipsis"></i>,</div>
          <img src="${data.picture}" id="userimage"> ${data.user} 
          <h2 id="forumName">#${forum_name}</h2>
          <p>${data.description}</p>
          <div class="post-details">
            <div class="post-date-time">${formattedDate} ${formattedTime}</div>
            <div class="replies">${noOfReply} replies</div>
    
          </div>
        `;
          postContainer.appendChild(postElements);
        });
      });
    } else {
      const currentTime = new Date();
      const recentThreshold = new Date(currentTime);
      recentThreshold.setDate(currentTime.getDate() - 1);
      forumRef
        .orderBy("timestamp", "desc")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            const data = doc.data();
            var forum_name = doc.id;
            let numberOfFields = Object.keys(data).length;
            var noOfReply = parseInt(numberOfFields) - 4;
            var postElements = document.createElement("div");
            var time = data.timestamp.toDate();
            const formattedDate = time.toLocaleDateString("en-Sg", {
              day: "numeric",
              month: "short",
            });
            const formattedTime = time.toLocaleTimeString("en-Sg", {
              hour: "2-digit",
              minute: "2-digit",
            });
            postElements.innerHTML = `
          <div class="post-content" id = "${forum_name}" onclick="goComment('${forum_name}')">
          <div class ="ellipsis" onmouseover="edit_forum('${forum_name}')">><i class="fa-solid fa-ellipsis"></i>,</div>
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
  });
}

function goComment(element) {
  window.location.href = "reply.html";
  localStorage.setItem("postId", element);
}
//for comment





function goback() {
  window.location.href = "forum.html";
}



function edit_forum(forum_name){
  var deleteBtn = document.getElementById("deletebtn-" + forum_name);
  if (!deleteBtn) {
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
        const replyRef = db.collection("post").doc(forum_name);
        replyRef.get().then((doc) => {
          const data_ref = doc.data();
          var post_name = data_ref.user;
          if (fname == post_name) {
            if (deleteBtn == undefined) {
              var editbutton = document.createElement("button");
              var deleteButton = document.createElement("button");
              deleteButton.setAttribute("type", "button");
              deleteButton.id = "deletebtn-" + forum_name;
              deleteButton.className = "delete-button";
              deleteButton.setAttribute(
                "onmouseover",
                "delete_post_load('" + forum_name + "')"
              );
              deleteButton.innerHTML = "Delete";
              let replyContent = document.getElementById(forum_name);
              replyContent.appendChild(deleteButton);

              // Show the delete button
              deleteButton.style.display = "block";
              // show the edit button
            } else {
              // Toggle the visibility of the delete button
              deleteBtn.style.display =
                deleteBtn.style.display === "block" ? "none" : "block";
            }
          } else {
            if (deleteBtn) {
              deleteBtn.style.display = "none";
            }
          }
        });
      }
    });
  });
} else {
  // Toggle the visibility of the delete button
  deleteBtn.style.display = deleteBtn.style.display === "block" ? "none" : "block";
}
}

function delete_post_load(post_element){
  const replyRef = db.collection("post").doc(post_element);
  return replyRef
    .delete()
    .then(() => {
      console.log(
        `Field '${post_element}' successfully deleted from the document.`
      );
      var fname = document.getElementById(post_element);
      fname.style.display = "none";
    })
    .catch((error) => {
      console.error("Error deleting field: ", error);
    });
}

function edit_post_load(post_element){

}