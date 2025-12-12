import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA7-G3ZPT-ZBJ-cfyVRGTxYwhwvGFb9qig',
  authDomain: 't-tow-39100614-4b786.firebaseapp.com',
  projectId: 't-tow-39100614-4b786',
  storageBucket: 't-tow-39100614-4b786.firebasestorage.app',
  messagingSenderId: '850514831066',
  appId: '1:850514831066:web:ddf30ac4a4d02932b467e3',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

try {
  enableIndexedDbPersistence(db);
} catch (error) {
  if (error.code == 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a time.
    // ...
  } else if (error.code == 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
  }
}
