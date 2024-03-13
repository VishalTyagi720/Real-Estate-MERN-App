// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-95d7c.firebaseapp.com",
  projectId: "real-estate-95d7c",
  storageBucket: "real-estate-95d7c.appspot.com",
  messagingSenderId: "1042546787788",
  appId: "1:1042546787788:web:5e670b7c7f2c640cc48969"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);