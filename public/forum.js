

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
    console.log(app)
  }

  // prints the firebase connection to check for bug
  // console.log(app);
  if (typeof db == 'undefined') {
    db = firebase.firestore();
    auth = firebase.auth();
  }
  load_forum()
});
var x = "";
document.getElementById("yourDocumentID").addEventListener("click", Create_post);
function Create_post(event) {
  event.preventDefault();
  const docRef = db.collection("Users");
  var user = sessionStorage.getItem("user");
  var userObject = JSON.parse(user);
  var uid = userObject.uid;
  console.log(uid)
  var post = document.getElementById("create_text").value;

  docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      var docId = doc.id;
      console.log(docId);
      if (docId == uid) {
        const userRef = db.collection("Users").doc(uid);
        userRef.get().then((doc) => {
          if (doc.exists) {
            var first_name = doc.data().name;
            console.log(first_name)
            var image_url = doc.data().image_url || "./images/profile photo.jpeg";
            var reply = "";
          }
          const dataRef = db.collection("forum").doc(x);
          data_to_insert = {
            chat: {
              chat: post,
              name: first_name,
              picture: image_url,
              replied: {
                name: "",
                picture: "",
              }
            }
          };
          dataRef.update(data_to_insert).then(() => {
            console.log("data is inside");

          }).catch(function (error) {
            console.error("Error updating data:", error);
          }
          )
        })
      }

    })
  })
  document.getElementById("create").reset();
  window.location.reload();
};


//  

var history_arr = [];
function check_forum(docId) {
  x = docId;
  history_arr.push(x);
  const forumElements = document.querySelectorAll(".new_forum");
  const docRef = db.collection("forum").doc(docId);
  docRef.get().then((doc) => {
    if (doc.exists) {
      const chatData = doc.data().chat;
      const isChatEmpty = (
        chatData.chat.trim() === "" &&
        chatData.name.trim() === "" &&
        chatData.picture.trim() === "" &&
        chatData.replied.name.trim() === "" &&
        chatData.replied.picture.trim() === ""
      );
      if (isChatEmpty) {
        var post_class = document.getElementById("create_post");
        post_class.style.display = "block"
      }
      // Document data is in doc.data(
      console.log("Document data:", doc.data());
      var insert_post = document.querySelector(".post_headerDescription");
      var createElement = document.createElement("p");
      createElement.setAttribute("class", docId);
      var dis_element = document.getElementById(docId);
      dis_element.style.display = "block";

      const things = doc.data();
      for (thing in things) {
        var chats = things[thing].chat;
        var uid = things[thing].name;
        if (typeof chats === "undefined" || typeof uid === "undefined" || typeof things[thing].chat == "" || chats == "") {
          var createElement = document.createElement("p");
          var txt = document.createTextNode("Insert your first post here!");
          createElement.appendChild(txt);
          insert_post.appendChild(createElement);
          var reply_class = document.getElementById("reply");
          reply_class.style.display = "none";


        } else {

          var text = document.createTextNode(chats);
          createElement.appendChild(text);
          insert_post.appendChild(createElement);
          // Display the "Add Post" button
          var textontop = document.getElementById("textontop");
          textontop.style.display = "none";
          var addPostButton = document.getElementById("postBox");
          addPostButton.style.display = "block";
          var linefooter = document.getElementById("linefooter");
          linefooter.style.display = "block";
          var reply_class = document.getElementById("reply");
          reply_class.style.display = "block";
          const userRef = db.collection("Users").doc(uid);
          userRef.get().then((doc) => {
            // var things = doc.data();
            var name1 = doc.data().name;
            console.log(name1);
            var picture = things["picture"]
            var picture_ref = document.querySelector(".post_avatar");
            var create_image = document.createElement("img");
            var src = document.createTextNode("src" + picture)
            console.log(src);
            create_image.appendChild(src);
            picture_ref.appendChild(create_image);
            console.log(picture_ref);
            var header_name = document.querySelector(".post_headerSpecial");
            var name_ref = document.createElement("p");
            var txt = document.createTextNode(name1);

            console.log(txt)
            name_ref.appendChild(txt);
            header_name.appendChild(name_ref);
          })
        }

      }
      const userRef = db.collection("Users").doc(uid);
      userRef.get().then((doc) => {
        var things = doc.data();
        var name1 = things["name"];
        var picture = things["picture"]
        var picture_ref = document.querySelector(".post_avatar");
        var create_image = document.createElement("img");
        var src = document.createTextNode("src" + picture)
        console.log(src);
        create_image.appendChild(src);
        picture_ref.appendChild(create_image);
        console.log(picture_ref);
        var header_name = document.querySelector(".post_headerSpecial");
        var name_ref = document.createElement("p");
        var txt = document.createTextNode(name1);

        console.log(txt)
        name_ref.appendChild(txt);
        header_name.appendChild(name_ref);
      })
      if (typeof chats === "undefined") {
        chats = "";
      }
      var text = document.createTextNode(chats);
      createElement.appendChild(text);
      insert_post.appendChild(createElement);
      // Display the "Add Post" button
      var textontop = document.getElementById("textontop");
      textontop.style.display = "none";
      var addPostButton = document.getElementById("postBox");
      addPostButton.style.display = "block";
      var linefooter = document.getElementById("linefooter");
      linefooter.style.display = "block";
      var reply_class = document.getElementById("reply");
      reply_class.style.display = "block";
      console.log(x)


    }
  })
  page_rest(x)


}
var lists = [];
function page_rest(element) {
  console.log(history_arr)
  lists.push(element);
  console.log(lists)
  history_arr = history_arr.filter(item => item !== undefined);
  console.log(history_arr)
  var last_curr_page = history_arr[history_arr.length - 2];
  console.log(last_curr_page);
  var cur_page = lists.pop();
  console.log(cur_page);
  if (last_curr_page != "") {
    if (last_curr_page != cur_page) {
      var dis_element = document.getElementsByClassName(last_curr_page)[0];
      console.log(dis_element)
      dis_element.style.display = "none";
    }
    var CountElement = document.getElementsByClassName(cur_page);
    for (var i = 0; i < CountElement.length; i++) {
      CountElement[i].style.display = "none";
    }
  }
}



function load_forum() {

  const docRef = db.collection("forum");
  docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      let docId = doc.id;
      let forum_name = document.createTextNode("#" + docId);
      var createElement = document.createElement("div");
      createElement.setAttribute("class", "new_forum");
      createElement.setAttribute("onclick", "check_forum()")
      createElement.setAttribute("id", docId);
      var forum_ref = document.querySelector(".new_forum");
      createElement.appendChild(forum_name);
      forum_ref.insertAdjacentElement('afterend', createElement);
      var forum_id = document.getElementById(docId);
      forum_id.style.cursor = "pointer";
      createElement.addEventListener("click", function (event) {
        check_forum(docId); // Pass the clicked forum's ID
      });



    })
  }).catch(function (error) {
    console.error("Error loading forum:", error);
  });

  // This code will execute when the page is fully loaded

};



function addNewForum() {
  var forum = document.getElementById("newForumName").value;
  docRef = db.collection('forum');
  docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      let docId = doc.id;
      console.log(docId);
      if (forum != "") {
        var chat1 = {};
        if (forum != docId) {
          chat1 = {
            chat: {
              chat: "",
              name: "",
              picture: "",
              replied:
              {
                name: "",
                picture: ""
              }
            }
          }
        }
        db.collection("forum").doc(forum).set(chat1).then(() => {
          console.log("data is inside");
          location.reload();
        }).catch((error) => {
          console.error("sth wrong", error);
        });
      }

    })
  })
}

document.getElementById("addPostButton").addEventListener("click", NewChat);
function NewChat(event) {
  event.preventDefault();
  const docRef = db.collection("Users");
  var user = sessionStorage.getItem("user");
  var userObject = JSON.parse(user);
  var uid = userObject.uid;
  var new_post = document.getElementById("post_text").value;
  //find who is this user name///
  docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      var docId = doc.id;
      console.log(docId);
      if (docId == uid) {
        const userRef = db.collection("Users").doc(uid);
        userRef.get().then((doc) => {
          if (doc.exists) {
            var first_name = doc.data().name;
            var image_url = doc.data().image_url || "./images/profile photo.jpeg";

            var reply = "";
            var chat = "chat" + (count)
          }
          const dataRef = db.collection("forum").doc(x);
          var data_to_insert = {};
          var count = doc.data().name;
          data_to_insert[count] = {
            chat: new_post,
            name: first_name,
            picture: image_url,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            replied: {
              name: "",
              picture: "",
            }
          };

          dataRef.update(data_to_insert).then(() => {
            console.log("data is inside");


          }).catch(function (error) {
            console.error("Error updating data:", error);
          }
          )
        })
      }

    })
  })
  document.getElementById("post_box").reset();
  window.location.reload()

};

function lets_reply(docId) {
  const docRef = db.collection("forum").doc(docId);
  if (docRef) {
    docRef.get().then((doc) => {
      if (doc.exists) {
        // Document data is in doc.data(
        console.log("Document data:", doc.data());
        var things = doc.data();
        console.log(things);
        var replies = [];
        for (thing in things) {
          var reply = things[thing].replied;
          if (reply.name || reply.picture) {
            replies.push({
              name: reply.name || "",
              picture: reply.picture || ""
            })
          }
        } return replies;
      }
    })
  }
}
