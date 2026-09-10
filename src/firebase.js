// src/firebase.js
// This config is public/safe — meant to ship in client apps.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAq1sZGs2yKZtaoGPbdzzKf5mOmAgur7FA",
  authDomain: "lead-gen-tool-508220.firebaseapp.com",
  projectId: "lead-gen-tool-508220",
  storageBucket: "lead-gen-tool-508220.firebasestorage.app",
  messagingSenderId: "330696549399",
  appId: "1:330696549399:web:cc4b3189f3bd14c90e6852",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
