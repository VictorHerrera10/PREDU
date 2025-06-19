// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; 
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAkV5fwU5W5vT_O5a8VUdISs9qrIQXHq1Q",
  authDomain: "predu-pe.firebaseapp.com",
  projectId: "predu-pe",
  storageBucket: "predu-pe.firebasestorage.app",
  messagingSenderId: "460865635385",
  appId: "1:460865635385:web:39c04e1c406294e3a779e8"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);  

export { auth, db };
