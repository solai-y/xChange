
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
  // console.log(app);x
  if (typeof db == 'undefined') {
    db = firebase.firestore();
    auth = firebase.auth();
  }
  load_forum()
  personImage()
  load_reply_forum()
  
});
var x = ""; //its the forum 
document.getElementById("yourDocumentID").addEventListener("click", Create_post);
function Create_post(event) { //just updating that first forum data chat
  event.preventDefault();
  const docRef = db.collection("Users");
  var user = sessionStorage.getItem("user");
  var userObject = JSON.parse(user);
  var uid = userObject.uid;
  var post = document.getElementById("create_text").value;

  docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      var docId = doc.id;
      if (docId == uid) {
        const userRef = db.collection("Users").doc(uid);
        userRef.get().then((doc) => {
          if (doc.exists) {
            var first_name = doc.data().name;
            var image_url = doc.data().image_url || "./images/profile photo.jpeg";
          }
          const dataRef = db.collection("forum").doc(x);
          dataRef.get().then((doc) => {
            data_to_insert = {}
            var dataSize = Object.keys(doc.data()).length
            var nums = parseInt(dataSize) + 1
            data_to_insert["chat0"] = {
              chat: post,
              name: first_name,
              picture: image_url,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              replied: {
                name: "",
                picture: "",
              }
            }
            dataRef.update(data_to_insert).then(() => {
              console.log("data is inside");
              var area_text = document.getElementsByClassName("post_headerDescription")[0];
              area_text.innerHTML = `<p> ${post} </p>`;
              var picture_ref = document.querySelector(".post_avatar");
              var create_image = document.createElement("img");
              create_image.setAttribute("src", image_url)
              create_image.setAttribute("id", x + "picture")
              picture_ref.appendChild(create_image);
              var header_name = document.querySelector(".post_headerText");
              var create_div_tag = document.createElement("div")
              create_div_tag.setAttribute("class", "user")
              var header_text = document.createTextNode(first_name);
              create_div_tag.appendChild(header_text)
              header_name.appendChild(create_div_tag)

            }).catch(function (error) {
              console.error("Error updating data:", error);
            })
          });
        })
      }
    }

    )
  })


  document.getElementById("create").reset();

};


//  
function personImage(){
  const docRef = db.collection("Users");
  var user = sessionStorage.getItem("user");
  var userObject = JSON.parse(user);
  var uid = userObject.uid;
  docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      var docId = doc.id;
      if (docId == uid) {
        const userRef = db.collection("Users").doc(uid);
        userRef.get().then((doc) => {
          if (doc.exists) {
            console.log(doc.data().image_url)
            var image_url = doc.data().image_url || "/images/profile photo.jpeg";
            var pic_ref = document.querySelector(".person_image");
            var create_div = document.createElement("img");
            create_div.setAttribute("style", "width:70px")
            create_div.setAttribute("src", image_url)
            pic_ref.insertAdjacentElement("beforeend",create_div)
          }
        })
      }
    })
  })
}


var history_arr = [];
function check_forum(docId) {

  x = docId; //forum identification 
  history_arr.push(x); //to use for the page rest
  const forumRef = db.collection("forum").doc(docId);

  // this count is for looping the data if possible so to be able to showcase everything

  //get the data from the forum 
  forumRef.get().then((doc) => {
    const data = doc.data() // inside here is all the data from the firebase
    //changing the welcome text
    const wlcText = document.getElementById("welcomeText");
    wlcText.textContent = `Welcome to the #${docId} forum`;
    //testing area
    //first condition: If the forum is new
    if (data["chat0"].chat == "" && data["chat0"].name == "") {
      const insert_post = document.querySelector(".post_headerDescription");
      //create a container instead
      const cont = document.createElement("div");
      //adding the create post
      var post_class = document.getElementById("create_post");
      post_class.style.display = "block";
      //create empty text node to tell them to insert their first post here!
      var createPtag = document.createElement("p");
      createPtag.setAttribute("class", docId);
      var txt = document.createTextNode("Insert your first post here!");
      createPtag.appendChild(txt);
      insert_post.appendChild(createPtag);
      //hide the welcome text
      var Welcome_txt = document.getElementById("textontop");
      Welcome_txt.style.display = "none";
      //hide the add post button
      var addPostButton = document.getElementById("postBox");
      addPostButton.style.display = "none";
      //hide the reply and the grey 
      var linefooter = document.getElementById("linefooter");
      linefooter.style.display = "none";
      var reply_class = document.getElementById("replyButton");
      reply_class.style.display = "none";
      
    } else {
      //need to create loop already so can individually add the data
      var dataSize = Object.keys(data).length //here inside size of the data

      //Loop
      for (let count = 0; count < dataSize; count++) {
        var nums = "chat" + count; //remember we are assuming that all the data is the 'chat'
        var chats = data[nums].chat;
        var person_name = data[nums].name;
        //create a container instead
        var cont = document.createElement("div");
        cont.setAttribute('class', 'containerX')
        var txt = document.createTextNode(chats); //data is in the text
        const insert_post = document.querySelector(".post_headerDescription"); //inserting in this section
        var create_p_tag = document.createElement("p"); //create the p tag for the data in
        create_p_tag.setAttribute("id", nums)
        create_p_tag.setAttribute("class", docId); //set the p tag to p class = docId
        create_p_tag.appendChild(txt); //appending the text to the p tag

        // insert_post.appendChild(create_p_tag);
        //display the "Add Post" Button
        var addPostButton = document.getElementById("postBox");
        addPostButton.style.display = "block";
        //remove the welcome when the forum is pressed
        var Welcome_txt = document.getElementById("textontop");
        Welcome_txt.style.display = "none";
        //adding the picture 
        var image = data[nums].picture
        const picture_ref = document.querySelector(".post_avatar");
        var create_image = document.createElement("img");
        var spn = document.createElement("span");
        var txt = document.createTextNode(person_name)
        spn.appendChild(txt);
        create_image.appendChild(spn);
        create_image.setAttribute("style", "width:70px")
        create_image.setAttribute("src", image)
        create_image.setAttribute("id", x + "Picture")
        cont.appendChild(create_image);
        //adding the name 
        var create_div_tag = document.createElement("div")
        create_div_tag.setAttribute("id",nums)
        create_div_tag.setAttribute("class", "user")
        var header_text = document.createTextNode(person_name);
        create_div_tag.appendChild(header_text)
        cont.appendChild(create_div_tag)
        //adding grey line
        var linefooter = document.getElementById("linefooter");
        linefooter.style.display = "block";
        //showing the likes button 
        var create_like = document.createElement("button");
        create_like.setAttribute("class","likebutton");
        create_like.setAttribute("id","likebtn");
        create_like.setAttribute("style","display:flex");
        create_like.setAttribute("onclick","like()");
        var heart_link = document.createElement("i");
        heart_link.setAttribute("class","fa-regular fa-heart")
        create_like.appendChild(heart_link);
        //showing the reply button
        var create_reply_btn = document.createElement("button");
        create_reply_btn.setAttribute("id", "reply");
        create_reply_btn.setAttribute("class", "btn btn-primary");
        create_reply_btn.setAttribute("style", "display:block");
        create_reply_btn.setAttribute("onclick", "open_reply_box()");
        var reply_link = document.createElement("i");
        reply_link.setAttribute("style","color: #12850a")
        reply_link.setAttribute("class","fa-solid fa-reply")
        create_reply_btn.appendChild(reply_link)
        //must make sure its not showing up
        var post_class = document.getElementById("create_post");
        post_class.style.display = "none";
        //partition1 up
        var partition1 = document.getElementById("partition1");
        partition1.style.display= "block";
        //testing area
        cont.appendChild(create_p_tag);
        cont.appendChild(create_like);
        cont.appendChild(create_reply_btn)
        insert_post.appendChild(cont)

      }
    }



  })
  page_reset(x)
}



var list_of_the_changing_page = [];
function page_reset(element) {
  list_of_the_changing_page.push(element)
  list_of_the_changing_page = list_of_the_changing_page.filter(item => item !== undefined)
  history_arr = history_arr.filter(item => item !== undefined);
  let previous_page = history_arr[history_arr.length - 2];
  let current_page = list_of_the_changing_page[list_of_the_changing_page - 1];
  if (current_page != previous_page) {
    var dis_element = document.getElementsByClassName(previous_page)[0];
    dis_element.remove()
    var pic_element = document.getElementById(previous_page + "Picture");
    pic_element.remove()
    var user_element = document.getElementsByClassName("user")[0];
    user_element.remove()
    var reply_class = document.getElementById("reply");
    reply_class.remove()
    var linefooter = document.getElementById("linefooter");
    linefooter.style.display = "none";
    var addPostButton = document.getElementById("postBox");
    addPostButton.style.display = "none";
    var post_class = document.getElementById("create_post");
    post_class.style.display = "none";
    var create_like = document.getElementById("likebtn");
    create_like.style.display = "none";

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
        var chat = {};
        if (forum != docId) {

          chat = {
            chat0: {
              chat: "",
              name: "",
              picture: "",
              timestamp:"",
              replied:
              {
                name: "",
                picture: ""
              }
            }
          }
        }
        db.collection("forum").doc(forum).set(chat).then(() => {
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

  docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      var docId = doc.id;
      if (docId == uid) {
        var first_name = doc.data().name
        console.log(first_name)
        dataRef = db.collection("forum").doc(x);
        dataRef.get().then((doc) => {
          const userData = doc.data();
          var chatCount = Object.keys(userData).length; // chat count works
          var count = parseInt(chatCount)
          console.log(count)
          var image_url = doc.data().image_url || "./images/profile photo.jpeg";
          var chats = "chat" + count // it auto add itself wth
          var data_to_insert = {};


          data_to_insert[chats] = {
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
          })
        })
      }
    })

  })
  document.getElementById("post_box").reset();
}


function open_reply_box(){
    var contact = document.getElementById("replyInputContainer");
    contact.style.display = "block";
    // Set the flag to true to indicate it's open 
  }
function cancel_btn(){
  var contact = document.getElementById("replyInputContainer");
  contact.style.display = "None";
}


function lets_reply(event) {
  // Capture the reply text from the input field (e.g., with id "reply_text")
    // Check if the reply container is not already open
  
  
  var replyText = document.getElementById("replyInput").value;
  // Check if there's a reply text (you can add more validation)
  if (!replyText) {
    console.log("Reply text is empty.");
  }
  //database of the user
  const UserRef = db.collection("Users");
  var user = sessionStorage.getItem("user");
  var userObject = JSON.parse(user);
  var uid = userObject.uid;
  var submittedReply = document.getElementById("replyInput").value;
  var element = document.querySelector(".user"); // Select the element using a class, or any other selector
  var chat = element.getAttribute("id"); // Get the chat  
  //calling the user
  UserRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      var docId = doc.id;
      if (docId == uid) {
        const userRef = db.collection("Users").doc(uid);
        userRef.get().then((doc) => {
          if (doc.exists) { 
            //information gathers from the userRef
            var first_name = doc.data().name;
            var image_url = doc.data().image_url || "./images/profile photo.jpeg";
            const docRef = db.collection("forum").doc(x);
            var data_to_insert = {};
            docRef.get().then((doc)=>{
            //update the current object 
            const data = doc.data()
            console.log(chat)
            data_to_insert[chat] = {
              chat: data[chat].chat,
              name: data[chat].name,
              picture: data[chat].picture,
              timestamp: data[chat].timestamp,
              replied: {
                reply: submittedReply,
                name: first_name,
                picture: image_url,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
              }
            };
            //update the docref
            docRef.update(data_to_insert).then(() => {
              console.log("Reply added to the post.");
              var contact = document.getElementById("replyInputContainer");
              contact.style.display = "none";
              window.location.href = "reply.html";
              localStorage.setItem("forum",x)
              localStorage.setItem("chat",chat)
            }).catch((error) => {
              console.error("Error adding the reply:", error);
            });
          })
        }
        })
      }
    })
  });
  document.getElementById("replyInput").value = ""
}

window.onload = function() {
  // Check if the unique identifier is present on the current page
  var bodyElement = document.querySelector('body[data-load-reply="true"]');
  if (bodyElement) {
    console.log(bodyElement)
    // The identifier is present, so call the function
    load_reply_forum();
  }
};

function load_reply_forum() {
  var from_chat = localStorage.getItem("chat");
  var forum_number = localStorage.getItem("forum")
  var chats = from_chat
  const forumRef = db.collection("forum").doc(forum_number);
  forumRef.get().then((doc) => {
      const data = doc.data();
      //load the person we are replying to 
      var image = data[chats].picture;
      var fname = data[chats].name.toString();
      var load_txt = data[chats].chat;
      var timestamp = data[chats].timestamp;
      //load the replies
      var image_reply = data[chats].replied.picture;
      var reply_name = data[chats].replied.name;
      var the_reply = data[chats].replied.reply;
      var reply_timestamp = data[chats].replied.timestamp;
      //show image
      var image_ref = document.getElementById("ld_image");
      var create_img_tag = document.createElement("img");
      create_img_tag.setAttribute("src",image);
      create_img_tag.setAttribute("style", "width:70px")
      image_ref.insertAdjacentElement("afterbegin",create_img_tag);
      //show the name 
      var header_ref = document.getElementById("ld_name");
      var name_div = document.createElement("div");
      var txtnode = document.createTextNode(fname);
      name_div.setAttribute("class","reply_user");
      name_div.appendChild(txtnode);
      header_ref.insertAdjacentElement("afterbegin",name_div);
      //show the reply
      var txt_ref = document.getElementById("load_text");
      var div_tag1 = document.createElement("div");
      div_tag1.setAttribute("class","reply_text");
      var txtnode = document.createTextNode(load_txt);
      div_tag1.appendChild(txtnode);
      txt_ref.appendChild(div_tag1);
      //user reply
      var header_ref = document.getElementById("reply_of_users");
      var name_div = document.createElement("div");
      var txtnode = document.createTextNode(the_reply);
      name_div.setAttribute("class","replyUsers");
      name_div.appendChild(txtnode);
      header_ref.insertAdjacentElement("afterbegin",name_div);
      //user image
      var image_ref = document.getElementById("imageofusers");
      var create_img_tag = document.createElement("img");
      create_img_tag.setAttribute("src",image_reply);
      create_img_tag.setAttribute("style", "width:70px")
      image_ref.insertAdjacentElement("afterbegin",create_img_tag);   
      //user name
      var header_ref = document.getElementById("reply_name");
      var name_div = document.createElement("div");
      var txtnode = document.createTextNode(reply_name);
      name_div.setAttribute("class","reply_user");
      name_div.appendChild(txtnode);
      header_ref.insertAdjacentElement("afterbegin",name_div);
      //time stamp

      
      



})
}


function goBack() {
  window.history.back();
}

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("submitReplyButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}