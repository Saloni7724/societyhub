// Import the functions you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9yqpHyYVupPYCs8qVP5fYwegj9vybRKk",
  authDomain: "societyhub-eac50.firebaseapp.com",
  projectId: "societyhub-eac50",
  storageBucket: "societyhub-eac50.firebasestorage.app",
  messagingSenderId: "188780339026",
  appId: "1:188780339026:web:fd2be4982d0df89d48e48b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// Export services
export { db, auth };
export const storage = getStorage(app);