
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
