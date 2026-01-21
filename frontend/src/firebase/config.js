// ⭐⭐⭐ FILE LOCATION: src/firebase/config.js ⭐⭐⭐

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMGFMUjk7qjRyNBO2JHFc66BCyHTdMf88",
  authDomain: "ekart-shop-7d2b4.firebaseapp.com",
  projectId: "ekart-shop-7d2b4",
  storageBucket: "ekart-shop-7d2b4.firebasestorage.app",
  messagingSenderId: "97853008485",
  appId: "1:97853008485:web:581a0e0208a1cd13ac748c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize GitHub Provider
export const githubProvider = new GithubAuthProvider();

// Export app as default
export default app;