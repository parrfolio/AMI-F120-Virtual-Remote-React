import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: 'AIzaSyCEPF0tMuYbcWHQD8gvVhJjqYtDw-DtOBg',
    authDomain: 'rsdlist.firebaseapp.com',
    databaseURL: 'https://rsdlist.firebaseio.com',
    projectId: 'rsdlist',
    storageBucket: 'rsdlist.appspot.com',
    messagingSenderId: '110371937536',
    appId: '1:110371937536:web:95d514076de6fa736b67e5',
    measurementId: 'G-2WMBQ8Z999',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Auth Providers
export const googleAuthProvider = new GoogleAuthProvider();
export const facebookAuthProvider = new FacebookAuthProvider();
export const twitterAuthProvider = new TwitterAuthProvider();
export const appleAuthProvider = new OAuthProvider('apple.com');

export const storageKey = 'KEY_FOR_LOCAL_STORAGE';
