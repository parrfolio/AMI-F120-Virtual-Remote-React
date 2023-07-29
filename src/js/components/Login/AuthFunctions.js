import {
  firebaseAuth,
  db,
  twitterAuthProvider,
  googleAuthProvider,
  appleAuthProvider,
  facebookAuthProvider,
} from "../../firestore/database";

export function auth(email, pw, first, last) {
  return firebaseAuth()
    .createUserWithEmailAndPassword(email, pw)
    .then(
      function(user) {
        var user = firebaseAuth().currentUser;
        db.collection("users")
          .doc(user.uid)
          .set({
            first: first,
            last: last,
            email: email,
            uid: user.uid,
            providerId: "email_user",
          })
          .then(
            function() {
              console.log("added to users db");
            },
            function(error) {
              console.log("ERROR adding to users db");
            }
          );
      },
      function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == "auth/weak-password") {
          alert("The password is too weak.");
        } else {
          console.error(error);
        }
      }
    );
}

export function twitterAuth() {
  return firebaseAuth()
    .signInWithPopup(twitterAuthProvider)
    .then(function(result) {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      const token = result.credential.accessToken;
      const secret = result.credential.secret;
      // The signed-in user info.
      const twitterUser = result.user;
      console.log(twitterUser.providerData[0]);

      const user = firebaseAuth().currentUser;
      db.collection("users")
        .doc(user.uid)
        .set({
          first: user.displayName,
          last: user.displayName,
          email: user.email,
          uid: user.uid,
          avatar: user.photoURL,
          phone: user.phoneNumber,
          providerId: "twitter_user",
          token: token,
        })
        .then(
          function() {
            console.log("added to users db");
          },
          function(error) {
            console.log("ERROR adding to users db");
          }
        );
      // ...
    })
    .catch(function(error) {
      console.log(error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
}

export function googleAuth() {
  return firebaseAuth()
    .signInWithPopup(googleAuthProvider)
    .then(function(result) {
      var token = result.credential.accessToken;
      var googleUser = result.user;
      const user = firebaseAuth().currentUser;
      console.log(user);
      db.collection("users")
        .doc(user.uid)
        .set({
          first: user.displayName,
          last: user.displayName,
          email: user.email,
          uid: user.uid,
          avatar: user.photoURL,
          phone: user.phoneNumber,
          providerId: "google_user",
          token: token,
        })
        .then(
          function() {
            console.log("added to users db");
          },
          function(error) {
            console.log("ERROR adding to users db");
          }
        );
    })
    .catch(function(error) {
      console.log(error);
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
}

export function appleAuth() {
  return firebaseAuth()
    .signInWithPopup(appleAuthProvider)
    .then((result) => {
      // The signed-in user info.
      console.log(appleAuthProvider);
      const user = result.user;

      // Apple credential
      const credential = appleAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const idToken = credential.idToken;

      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      console.log(error);
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The credential that was used.
      //const credential = appleAuthProvider.credentialFromError(error);

      // ...
    });
}

export function fbAuth() {
  return firebaseAuth()
    .signInWithPopup(facebookAuthProvider)
    .then(function(result) {
      var token = result.credential.accessToken;
      var fbUser = result.user;
      const user = firebaseAuth().currentUser;
      console.log(user);
      console.log(fbUser);
      console.log(token);
      db.collection("users")
        .doc(user.uid)
        .set({
          first: user.displayName,
          last: user.displayName,
          email: user.email,
          uid: user.uid,
          avatar: user.photoURL,
          phone: user.phoneNumber,
          providerId: "fb_user",
          token: token,
        })
        .then(
          function() {
            console.log("added to users db");
          },
          function(error) {
            console.log("ERROR adding to users db");
          }
        );
    })
    .catch(function(error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        var pendingCred = error.credential;
        var email = error.email;
        firebaseAuth()
          .fetchSignInMethodsForEmail(email)
          .then(function(methods) {
            alert("Your already have an accoun at, " + methods[0]);

            var provider = googleAuthProvider;
            // At this point, you should let the user know that they already has an account
            // but with a different provider, and let them validate the fact they want to
            // sign in with this provider.
            // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
            // so in real scenario you should ask the user to click on a "continue" button
            // that will trigger the signInWithPopup.
            firebaseAuth()
              .signInWithPopup(provider)
              .then(function(result) {
                // Remember that the user may have signed in with an account that has a different email
                // address than the first one. This can happen as Firebase doesn't control the provider's
                // sign in flow and the user is free to login using whichever account they own.
                // Step 4b.
                // Link to Facebook credential.
                // As we have access to the pending credential, we can directly call the link method.
                result.user
                  .linkAndRetrieveDataWithCredential(pendingCred)
                  .then(function(usercred) {
                    // Facebook account successfully linked to the existing Firebase user.
                    // save to db
                    console.log(usercred);
                    console.log("success!");
                  });
              });
          });
      }
    });
}
export function logout() {
  return firebaseAuth()
    .signOut()
    .then(function() {
      console.log("Signed Out!");
    })
    .catch(function(error) {
      // An error happened.
    });
}

export function login(email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw);
}

export function resetPassword(email) {
  return firebaseAuth().sendPasswordResetEmail(email);
}

// export function saveUser (user) {
//   return ref.child(`users/${user.uid}/info`)
//     .set({
//       email: user.email,
//       uid: user.uid
//     })
//     .then((user) => {
//           console.log(user)
//     })
// }

// Twitter
// Access token :9198472-PwZdg47w6qPFqVwGUDk9EeJuRYqGhePrVbTzTgFDrj

// Access token secret :yAwFjiA9rwJYWIsFYjy7TX2MAc96wCR56ZFQnhiHl2hJE
