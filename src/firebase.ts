import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA7-G3ZPT-ZBJ-cfyVRGTxYwhwvGFb9qig",
  authDomain: "t-tow-39100614-4b786.firebaseapp.com",
  projectId: "t-tow-39100614-4b786",
  storageBucket: "t-tow-39100614-4b786.firebasestorage.app",
  messagingSenderId: "850514831066",
  appId: "1:850514831066:web:ddf30ac4a4d02932b467e3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
