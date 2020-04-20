//@flow

import firebase from "firebase/app";

import "firebase/auth"; // for authentication
import "firebase/storage"; // for storage
//import 'firebase/database';    // for realtime database
import "firebase/firestore"; // for cloud firestore
//import 'firebase/messaging';   // for cloud messaging
//import 'firebase/functions';
import "firebase/analytics";

var config = {
  apiKey: "AIzaSyCEPF0tMuYbcWHQD8gvVhJjqYtDw-DtOBg",
  authDomain: "rsdlist.firebaseapp.com",
  databaseURL: "https://rsdlist.firebaseio.com",
  projectId: "rsdlist",
  storageBucket: "rsdlist.appspot.com",
  messagingSenderId: "110371937536",
  appId: "1:110371937536:web:95d514076de6fa736b67e5",
  measurementId: "G-2WMBQ8Z999",
};

firebase.initializeApp(config);
firebase.analytics();

export const db = firebase.firestore();

export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();

export const storage = firebase.storage();

export const firebaseAuth = firebase.auth;
export const twitterAuthProvider = new firebaseAuth.TwitterAuthProvider();
export const googleAuthProvider = new firebaseAuth.GoogleAuthProvider();
export const facebookAuthProvider = new firebaseAuth.FacebookAuthProvider();

export const storageKey = "KEY_FOR_LOCAL_STORAGE";

// export const isAuthenticated = () => {
// 	return !!firebaseAuth.currentUser || !!localStorage.getItem(storageKey);
// };
