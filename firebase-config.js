// config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAzpStPKhD_-N2tmCEVsDyo8wZQXfWxU4U",
  authDomain: "vendo-a-hora.firebaseapp.com",
  projectId: "vendo-a-hora",
  storageBucket: "vendo-a-hora.appspot.com", // ✅ Corrigido aqui
  messagingSenderId: "574485032720",
  appId: "1:574485032720:web:a58138a76b1cbeb732ff95",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
