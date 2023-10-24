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
  if (typeof db == 'undefined') {
    db = firebase.firestore();
    auth = firebase.auth();
  }
});
var x = "";
function Create_post() {

  const docRef = db.collection("Users");
  var uid = sessionStorage.getItem("user");
  var post = document.getElementById("create_text").value;
  console.log(post);
  docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      var docId = doc.id;
      console.log(docId);
      var first_name = "";
      var picture = "";
      var reply = "";
      console.log(doc.data().name)
    

      if (docId == uid) {
        var data = doc.data()
        first_name = data[uid].name;
        console.log(first_name)
        picture = doc.data().image_url;
        reply = "";
      }
      const dataRef = db.collection("forum").doc(x);
        data_to_insert = {
          chat: {
            chat: post,
            name: first_name,
            picture: picture,
            replied:{
              name: "",
              picture:"",
            }
          }
        };
        dataRef.update(data_to_insert).then(() => {
          console.log("data is inside");
          // location.reload();
        }).catch(function(error) {
          console.error("Error updating data:", error);
    }
        )
      })
    })

  };
  window.onload = load_forum





function check_forum(docId) {


  const forumElements = document.querySelectorAll(".new_forum");
  console.log(forumElements);
  const docRef = db.collection("forum").doc(docId);
  if (docRef) {
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
        var things = doc.data();
        console.log(things);

        for (thing in things) {
          var chats = things[thing].chat;
          console.log(chats)
          var uid = things[thing].name;
          if (typeof chats === "undefined" || typeof uid === "undefined" || typeof things[thing].chat == "") {
            var createElement = document.createElement("p");
            var txt = document.createTextNode("Insert your first post here!");
            createElement.appendChild(txt);
            insert_post.appendChild(createElement);
            var reply_class = document.getElementById("reply");
            reply_class.style.display = "block"

          }

        }
        const userRef = db.collection("Users").doc(uid);
        userRef.get().then((doc) => {
          var things = doc.data();
          var name1 = things["name"];
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

      }
    })

  }
  x = docId;
  return x
}

function load_forum() {
  
  const docRef = db.collection("forum");
  docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      let docId = doc.id;
      console.log(doc.data().chat.name);
      console.log(docId);
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

window.onload = load_forum

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


function NewChat() {
  var cur_page = document.getElementsByClassName("new_forum")[0];
  var forum_id = cur_page.getAttribute("id");
  console.log(forum_id)
  var post = document.getElementById("post_text").value;
  var uid = sessionStorage.getItem("user");
  docRef = db.collection('Users');

  docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      let docId = doc.id;

      console.log(docId);
      var first_name = "";
      var picture = "";
      var reply = "";

      if (docId == uid) {
        first_name = doc.uid.name;
        picture = doc.uid.picture;
        reply = showReply(docId);
      }
      dataRef = db.collection("forum").doc(forum_id);
      data_to_insert = {
        chat: {
          chat: post,
          name: first_name,
          picture: picture,
          replied: reply
        }
      };
      dataRef.update(data_to_insert).then(() => {
        console.log("data is inside");
      });

    })
  }
  )

}


function showReply(docId) {
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
