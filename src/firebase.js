import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHCQpMw56_jeXe_h36CIZwWPt1yeQuMls",
  authDomain: "product-fb1e7.firebaseapp.com",
  projectId: "product-fb1e7",
  storageBucket: "product-fb1e7.firebasestorage.app",
  messagingSenderId: "1048494571927",
  appId: "1:1048494571927:web:1e91958618239c176584d2",
  measurementId: "G-5XHFWVYJBV",
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
