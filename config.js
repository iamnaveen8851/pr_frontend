// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGHKW7SgNuTrGDCTt-r5VUVGqkkaujEmc",
  authDomain: "task-d2bd5.firebaseapp.com",
  projectId: "task-d2bd5",
  storageBucket: "task-d2bd5.firebasestorage.app",
  messagingSenderId: "716707674950",
  appId: "1:716707674950:web:038c6bdddcbb4756554347",
  measurementId: "G-0GWNKDNT6Z",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const githubProvider = new GithubAuthProvider();

export { auth, githubProvider };
