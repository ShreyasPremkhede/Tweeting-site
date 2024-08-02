import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";




const firebaseConfig = {
  apiKey: "AIzaSyAAeSvqauHAG9iyiDuA_iO9AtkRH5iKxUI",
  authDomain: "social-ce1c7.firebaseapp.com",
  projectId: "social-ce1c7",
  storageBucket: "social-ce1c7.appspot.com",
  messagingSenderId: "468605722520",
  appId: "1:468605722520:web:2d3a92975624a3523815ed",
  measurementId: "G-KKCCCCCHLL"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const firestore = getFirestore(app);