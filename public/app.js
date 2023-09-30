document.addEventListener("DOMContentLoaded", event=> {
    // initialize firebase
    const app = firebase.app();
    // prints the firebase connection to check for bugs
    console.log(app); // tbr

});

// function to log in with google account
function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    // log in promise
    firebase.auth().signInWithPopup(provider)
    .then(result => {
        const user = result.user;
        document.write(`Hello ${user.displayName}`)
        console.log(user); // tbr
    })
    .catch(err => {
        console.log(err);
    })
}