import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeSos32azRsZyuzcgsXdk5v4wOszx1aKI",
  authDomain: "n322-expo.firebaseapp.com",
  projectId: "n322-expo",
  storageBucket: "n322-expo.firebasestorage.app",
  messagingSenderId: "788226095903",
  appId: "1:788226095903:web:da684a1491e191c0a14e2a",
  measurementId: "G-E3T0TB3XPL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
