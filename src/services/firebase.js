// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNFyilYo2Pj0Ef01VUlOvMZY1IRcRbLDk",
  authDomain: "medicationreminderapp-26315.firebaseapp.com",
  projectId: "medicationreminderapp-26315",
  storageBucket: "medicationreminderapp-26315.firebasestorage.app",
  messagingSenderId: "745785976733",
  appId: "1:745785976733:web:b97f16db422ff05c793174",
  measurementId: "G-1QF44BMM2H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);