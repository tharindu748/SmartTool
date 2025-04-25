// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // 
import { getStorage } from "firebase/storage"; // Import the storage service
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "smarttool-d1db7.firebaseapp.com",
  projectId: "smarttool-d1db7",
  storageBucket: "smarttool-d1db7.firebasestorage.app",
  messagingSenderId: "467049804001",
  appId: "1:467049804001:web:11abc40463ee6fb64007a0",
  measurementId: "G-MM7QFJ719P"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const storage = getStorage(app);
export default app;
