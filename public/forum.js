
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
  homepage_forum()
});
// A global variable so that the forum can be called when the user is on that page
var x = "";
document.getElementById("yourDocumentID").addEventListener("click", Create_post);
// this is the function to create post 
function Create_post(event) { //just updating that first forum data chat
  event.preventDefault();
  //database referencing to the users
  const docRef = db.collection("Users");
  //getting the user from the sessionStorage
  var user = sessionStorage.getItem("user");
  var userObject = JSON.parse(user);
  var uid = userObject.uid;
  //getting the post from the create_text
  var post = document.getElementById("create_text").value;
  //referencing the data inside 
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
            var image_url = doc.data().image_url || "./images/profile photo.jpeg";
          }
          //forum reference
          const dataRef = db.collection("forum").doc(x);
          //The data we putting inside
          data_to_insert = {}
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
          //update the data
          dataRef.update(data_to_insert).then(() => {
            console.log("data is inside");
            //This is for the live data to show up 
            //we are showing the content
            var first_post = document.getElementById("content_post");
            //we create an attribute so that easier for us to do CSS
            first_post.setAttribute("class", "content_post");
            //DO not forget to append the post!
            //since now we have a content post, we can focus on making the image
            //since we are appending above the text 
            var user_create = document.getElementById("content_post");
            //create image
            var create_image = document.createElement("img");
            create_image.setAttribute("src", image_url)
            create_image.setAttribute("id", x + "picture")
            // we need to make the name is also beside the picture;
            var create_name = document.createTextNode(first_name)
            //append image
            user_create.appendChild(create_image);
            //append the name
            user_create.appendChild(create_name);
          }) //error
            .catch(function (error) {
              console.error("Error updating data:", error);
            })
        });
      }
    })
  })
  document.getElementById("create").reset();
};
//Create_post function got issue in creating the post out

//  
function personImage() {
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
            var image_url = doc.data().image_url || "/images/profile photo.jpeg";
            var pic_ref = document.querySelector(".picturearea");
            var create_div = document.createElement("img");
            create_div.setAttribute("style", "width:70px")
            create_div.setAttribute("src", image_url)
            pic_ref.insertAdjacentElement("afterbegin", create_div)
          }
        })
      }
    })
  })
}

//this global scope is to use for the page reset 
var history_arr = [];
function check_forum(docId) {
  //for this first part of the code we are looking if the page is empty
  x = docId; //forum identification 
  history_arr.push(x); //to use for the page rest
  const forumRef = db.collection("forum").doc(docId);
  //putting it on the local storage so that it is easier to receive
  localStorage.setItem("forum", x);
  // this count is for looping the data if possible so to be able to showcase everything
  //get the data from the forum 
  forumRef.get().then((doc) => {
    const data = doc.data() // inside here is all the data from the firebase
    //changing the welcome text
    const wlcText = document.getElementById("welcomeText");
    wlcText.textContent = `Welcome to the #${docId} forum`;
    //testing area
    //first condition: If the forum is new
    //why chat0? because its the first one ah if its empty
    if (data["chat0"].chat == "" && data["chat0"].name == "") {
      //remove the posts from the main homepage forum
      var homepage_forum_posts = document.getElementsByClassName("containerX");
      Array.from(homepage_forum_posts).forEach(function (element) {
        element.remove();
      });
      //
      var elx = document.getElementById("create_post");
      elx.style.display="block";
      var insert_post = document.querySelector(".Empty_post");
      //adding the create post
      //empty post block
      var abovePostClass = document.getElementsByClassName("Empty_post")[0];
      abovePostClass.style.display = "block"
      //button
      var post_class = document.getElementById("create_post_btn");
      post_class.style.display = "block";
      var get_box = document.getElementById("inputput");
      get_box.style.display="block"
      //create empty text node to tell them to insert their first post here!
      var createPtag = document.createElement("div");
      createPtag.setAttribute("class", docId);
      var txt = document.createTextNode("Insert your first post here!");
      createPtag.appendChild(txt);
      insert_post.insertAdjacentElement("afterbegin", createPtag);
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
      // Select the create post element
      $('post_button').modal('hide');

    } else {
      //if the data is not empty 
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
        cont.setAttribute("id","removal_easy")
        var txt = document.createTextNode(chats); //data is in the text
        const insert_post = document.querySelector(".post_headerSpecial"); //inserting in this section
        cont.setAttribute("onclick", "gotoreply()");
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
        var image = data[nums].picture;
        //homepageforum
        var homepage_forum = document.getElementById("allforums");
        homepage_forum.style.display = "none";

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
        create_div_tag.setAttribute("id", nums)
        create_div_tag.setAttribute("class", "user")
        var header_text = document.createTextNode(person_name);
        create_div_tag.appendChild(header_text)
        cont.appendChild(create_div_tag)
        //showing the likes button 
        var create_like = document.createElement("button");
        create_like.setAttribute("class", "likebutton");
        create_like.setAttribute("id", "likebtn");
        create_like.setAttribute("style", "display:flex");
        create_like.setAttribute("onclick", "like()");
        var heart_link = document.createElement("i");
        heart_link.setAttribute("class", "fa-regular fa-heart")
        create_like.appendChild(heart_link);
        //showing the reply button
        var create_reply_btn = document.createElement("button");
        create_reply_btn.setAttribute("id", "reply");
        create_reply_btn.setAttribute("class", "btn btn-primary");
        create_reply_btn.setAttribute("style", "display:block");
        create_reply_btn.setAttribute("onclick", "open_reply_box()");
        var reply_link = document.createElement("i");
        reply_link.setAttribute("style", "color: #12850a")
        reply_link.setAttribute("class", "fa-solid fa-reply")
        create_reply_btn.appendChild(reply_link)
        //must make sure its not showing up
        var post_class = document.getElementById("create_post");
        post_class.style.display = "none";
        //partition1 up
        var partition1 = document.getElementById("partition1");
        partition1.style.display = "block";
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
    var remov = document.getElementById("removal_easy");
    remov.remove();
}else{
  var elementsToRemove = document.querySelectorAll(".removal_easy");
  elementsToRemove.forEach(function (element) {
  element.remove();
});

}
}




//Load forum is when you click on the page forum and all the data is out
function load_forum() {
  //calling the forum database because you want the forum name
  const docRef = db.collection("forum");
  //loop it to get the data
  //this part of this function is to load forum name
  docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      //the docId is the forum name
      let docId = doc.id;
      //get the forum name so that I can press on it
      let forum_name = document.createTextNode("#" + docId);
      //div in the forum 
      var createElement = document.createElement("div");
      createElement.setAttribute("class", "new_forum");
      createElement.setAttribute("onclick", "check_forum()")
      createElement.setAttribute("id", docId);
      var forum_ref = document.querySelector(".new_forum");
      createElement.appendChild(forum_name);
      forum_ref.insertAdjacentElement('afterend', createElement);
      //hide the singapore ID idk why is it there but i just scared of screwing up the whole code
      var singaporeID = document.getElementById("singapore_forum");
      singaporeID.style.display = "none";
      // pointing the forum
      var forum_id = document.getElementById(docId);
      forum_id.style.cursor = "pointer";
      //when the user click on the forum name they go to that section 
      createElement.addEventListener("click", function (event) {
        check_forum(docId); // Pass the clicked forum's ID
      });



    })
  }).catch(function (error) {
    console.error("Error loading forum:", error);
  });

  // This code will execute when the page is fully loaded

};
//the load forum has no issue working perfectly fine

//this function is to create new forum 
function addNewForum() {
  //get the value from the input class
  var forum = document.getElementById("newForumName").value;
  // Clear the input field
  document.getElementById("newForumName").value = "";
  //take in the description
  var description = document.getElementById("fDescription").value;
  document.getElementById("fDescription").value = "";
  //Hide the modal
  $('#myModal').modal('hide');
  //reference the document we going to have the forum name in the document id inside
  docRef = db.collection('forum');
  docRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      //check to see if the document ID has the forum name already
      let docId = doc.id;
      console.log(docId);
      if (forum != "") {
        // if forum is not the same so it is unique
        if (forum != docId) {
          chat = {
            chat0: {
              description: description,
              chat: "",
              name: "",
              picture: "",
              timestamp: "",
              replied:
              {
                name: "",
                picture: ""
              }
            }
          }
        } else {
          alert("this forum name has been taken")
        }
        //update the forum
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
//no issue with the adding of the forum name



document.getElementById("addPostButton").addEventListener("click", NewChat);
function NewChat(event) {
  event.preventDefault();
  //document of the users
  const docRef = db.collection("Users");
  var user = sessionStorage.getItem("user");
  var userObject = JSON.parse(user);
  var uid = userObject.uid;
  //getting the post from the post box
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
          localStorage.getItem("name", first_name)
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


function open_reply_box() {
  var contact = document.getElementById("replyInputContainer");
  contact.style.display = "block";
  // Set the flag to true to indicate it's open 
}
function cancel_btn() {
  var contact = document.getElementById("replyInputContainer");
  contact.style.display = "None";
}
var check = document.getElementById("submitReplyButton");
check.addEventListener("click", lets_reply)
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
  var element = document.querySelector(".reply_user"); // Select the element using a class, or any other selector
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
            docRef.get().then((doc) => {
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
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                }
              };
              //update the docref
              docRef.update(data_to_insert).then(() => {
                console.log("Reply added to the post.");
                var contact = document.getElementById("replyInputContainer");
                contact.style.display = "none";
                window.location.href = "reply.html";
                localStorage.setItem("forum", x)
                localStorage.setItem("chat", chat)
              }).catch((error) => {
                console.error("Error adding the reply:", error);
              });
            })
          }
        })
      }
    })
  });
  document.getElementById("replyInput").value = "";
  event.preventDefault()
}

window.onload = function () {
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
    var image = data[chats].picture || "/images/profile photo.jpeg";
    var fname = data[chats].name.toString();
    var load_txt = data[chats].chat;
    localStorage.setItem("text", load_txt);
    localStorage.setItem("name", fname);
    var timestamp = data[chats].timestamp;
    //load the replies
    var image_reply = data[chats].replied.picture;
    var reply_name = data[chats].replied.name;
    var the_reply = data[chats].replied.reply;
    var reply_timestamp = data[chats].replied.timestamp;
    //show image
    var image_ref = document.getElementById("ld_image");
    var create_img_tag = document.createElement("img");
    create_img_tag.setAttribute("src", image);
    create_img_tag.setAttribute("style", "width:70px")
    image_ref.insertAdjacentElement("afterbegin", create_img_tag);
    //show the name 
    var header_ref = document.getElementById("ld_name");
    var name_div = document.createElement("div");
    var txtnode = document.createTextNode(fname);
    name_div.setAttribute("class", "reply_user");
    name_div.appendChild(txtnode);
    header_ref.insertAdjacentElement("afterbegin", name_div);
    //show the reply
    var txt_ref = document.getElementById("load_text");
    var div_tag1 = document.createElement("div");
    div_tag1.setAttribute("class", "reply_text");
    var txtnode = document.createTextNode(load_txt);
    div_tag1.appendChild(txtnode);
    txt_ref.appendChild(div_tag1);
    //user reply
    var header_ref = document.getElementById("reply_of_users");
    var name_div = document.createElement("div");
    var txtnode = document.createTextNode(the_reply);
    name_div.setAttribute("class", "replyUsers");
    name_div.appendChild(txtnode);
    header_ref.insertAdjacentElement("afterbegin", name_div);
    //user image
    var image_ref = document.getElementById("imageofusers");
    var create_img_tag = document.createElement("img");
    create_img_tag.setAttribute("src", image_reply);
    create_img_tag.setAttribute("style", "width:70px")
    image_ref.insertAdjacentElement("afterbegin", create_img_tag);
    //user name
    var header_ref = document.getElementById("reply_name");
    var name_div = document.createElement("div");
    var txtnode = document.createTextNode(reply_name);
    name_div.setAttribute("class", "reply_user");
    name_div.appendChild(txtnode);
    header_ref.insertAdjacentElement("afterbegin", name_div);
    //time stamp


    //from the new forum reply 
    var documentId = localStorage.getItem("text")
    var reply = localStorage.getItem("reply")
    const replyRef = db.collection("reply").doc(documentId);
    replyRef.get().then((doc) => {
      const data = doc.data();
      for (dts in data) {
        //checking if the data is in this forum;
        if (data[dts].forum == forum_number) {
          var constant_div = document.createElement("div")
          constant_div.setAttribute("id", dts)
          constant_div.setAttribute("style", "margin-bottom:20px;background-color: white;padding: 20px;margin: 20px;border-radius: 5px;")
          var fname = data[dts].name;
          var p_reply = data[dts].reply
          var p_image = data[dts].picture
          //load the person we are replying to
          var new_part = document.getElementById("another_id");
          var text_nod = document.createTextNode(fname);
          //create another div tag for the p tag
          var p_tag = document.createElement("p")
          var txt_nod_of_reply = document.createTextNode(p_reply);
          p_tag.appendChild(txt_nod_of_reply);
          var imgJ = document.createElement("img");
          imgJ.setAttribute("src", p_image);
          imgJ.setAttribute("style", "width:70px")
          constant_div.appendChild(imgJ);
          constant_div.appendChild(text_nod);
          constant_div.appendChild(p_tag);
          new_part.appendChild(constant_div);
        }
      }
    })
  })
}

function goBack() {
  window.history.back();
}

function homepage_forum() { //basically this function allows for the page to come up
  //forum reference
  const ForumRef = db.collection("forum");
  //do the loop to showcase all the forums 
  var count = 0;
  ForumRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      if (doc.data().chat == "" && doc.data().name == "") {
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
        cont.appendChild(createPtag)
        insert_post.appendChild(cont);

      }
      //testnumber
      var documentID = doc.id;
      var data = doc.data(doc.id)
      //chat
      var num = "chat"
      var nums = num + count
      var forum_chat = data[nums].chat;

      //timestamp
      var timestamp = data[nums].timestamp;
      const nanoseconds = timestamp.nanoseconds;
      const seconds = timestamp.seconds
      const timestamps = new Date(seconds * 1000 + nanoseconds / 1000000);
      //name
      var person_name = data[nums].name;
      //picture
      var user_picture = data[nums].picture || "/images/profile photo.jpeg"
      //create the div 
      var create_div_tag = document.createElement("div");
      create_div_tag.setAttribute("class", "containerX");
      create_div_tag.setAttribute("id","removal_easy")
      var txt = document.createTextNode(forum_chat); //data is in the text
      const insert_post = document.querySelector(".homepage_forum"); //inserting in this section
      var create_p_tag = document.createElement("p"); //create the p tag for the data in
      create_p_tag.setAttribute("id", "users");
      create_p_tag.setAttribute("class", "documentId"); //set the p tag to p class = docId
      create_p_tag.appendChild(txt);
      //having the timestamp
      var create_div_tsamp = document.createElement("div");
      create_div_tsamp.setAttribute("class", "timestamp");
      var txtnode = document.createTextNode(timestamps);
      create_div_tsamp.appendChild(txtnode);
      //create the doc id
      var documentId_number = document.createElement("h1");
      documentId_number.setAttribute("class", "documentID");
      var txtnode = document.createTextNode("#" + documentID);
      documentId_number.appendChild(txtnode)
      //display the "Add Post" Button
      var create_image = document.createElement("img");
      var spn = document.createElement("span");
      var txt = document.createTextNode(person_name);
      spn.appendChild(txt);
      create_image.appendChild(spn);
      create_image.setAttribute("style", "width:70px");
      create_image.setAttribute("src", user_picture);
      create_image.setAttribute("id", x + "Picture");

      //adding the name
      var create_div = document.createElement("div");
      create_div.setAttribute("id", "homepage_users");
      create_div.setAttribute("class", "home_user");
      var header_text = document.createTextNode(person_name);
      create_div.appendChild(header_text);
      //like button
      var create_like = document.createElement("button");
      create_like.setAttribute("class", "likebutton");
      create_like.setAttribute("id", "likebtn");
      create_like.setAttribute("style", "display:flex");
      create_like.setAttribute("onclick", "like()");
      var heart_link = document.createElement("i");
      heart_link.setAttribute("class", "fa-regular fa-heart");
      create_like.appendChild(heart_link);
      //showing the reply button
      var create_reply_btn = document.createElement("button");
      create_reply_btn.setAttribute("id", "reply");
      create_reply_btn.setAttribute("class", "btn btn-primary");
      create_reply_btn.setAttribute("style", "display:block");
      create_reply_btn.setAttribute("onclick", "open_reply_box()");
      var reply_link = document.createElement("i");
      reply_link.setAttribute("style", "color: #12850a");
      reply_link.setAttribute("class", "fa-solid fa-reply");
      create_reply_btn.appendChild(reply_link);
      //must make sure its not showing up
      var post_class = document.getElementById("create_post");
      post_class.style.display = "none";
      //partition1 up
      var partition1 = document.getElementById("partition1");
      partition1.style.display = "block";
      //testing area
      create_div_tag.appendChild(documentId_number);
      create_div_tag.appendChild(create_div_tsamp)
      create_div_tag.appendChild(create_div);
      create_div_tag.appendChild(create_image)
      create_div_tag.appendChild(create_p_tag);
      create_div_tag.appendChild(create_like);
      create_div_tag.appendChild(create_reply_btn);

      console.log(create_div_tag)
      insert_post.appendChild(create_div_tag);
      count++;
    })
  })
}
function gotoreply() {
  window.location.href = "reply.html";
  var doc = document.getElementById(x).value;
  localStorage.setItem("reply",doc)
}

const likeButton = document.getElementById("like-button");

// Initialize the like count
let colorchange = false;
var count = 0;
// Event listener for the like button
likeButton.addEventListener("click", like())
function like() {
  if (colorchange == false) {
    count++;
    colorchange = true
    localStorage.setItem("count_likes", count)
    var btn = document.getElementById("likebtn");
    btn.style.color = "red"
    btn.appendChild(count);
  } else {
    count--;
    colorchange = false
    localStorage.setItem("count_likes", count)
    var btn = document.getElementById("likebtn");
    btn.style.color = "green";
    btn.appendChild(count);
  }
}
document.getElementById("ContRply").addEventListener("submit", continous_reply);
function continous_reply(event) {

  var collectionName = localStorage.getItem("forum");
  var documentId = localStorage.getItem("text");
  // var  newRef = new db.collection(collectionName).doc(documentId);
  var cont_reply = document.getElementById("reply").value;

  const replyRef = db.collection("reply").doc(documentId)
  const newRef = db.collection("forum").doc(collectionName)
  var dataSize = 0;
  replyRef.get().then((doc) => {
    dataSize = Object.keys(doc.data()).length || 0;
    console.log(typeof dataSize)
    var chatCount = dataSize;// chat count works
    var count = parseInt(chatCount) + 1
    var image_url = doc.data().image_url || "./images/profile photo.jpeg";
    var reply = "reply" + count // it auto add itself wth
    var name = localStorage.getItem("name")
    var data_to_insert = {}
    data_to_insert[reply] = ({
      name: name,
      forum: collectionName,
      reply: cont_reply,
      picture: image_url,
      time: firebase.firestore.FieldValue.serverTimestamp()
    })
    replyRef.update(data_to_insert).then(() => {
      console.log("data is inside");
      localStorage.setItem("reply", reply);
      load_reply_forum()
    }).catch(function (error) {
      console.error("Error updating data:", error);
    })

  })
  event.preventDefault()
}