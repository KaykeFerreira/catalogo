// Importações dos módulos Firebase (versão modular v9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Configuração do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAzpStPKhD_-N2tmCEVsDyo8wZQXfWxU4U",
  authDomain: "vendo-a-hora.firebaseapp.com",
  projectId: "vendo-a-hora",
  storageBucket: "vendo-a-hora.appspot.com", // Correto
  messagingSenderId: "574485032720",
  appId: "1:574485032720:web:a58138a76b1cbeb732ff95",
  measurementId: "G-RJFSZNMHRQ"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços para uso em outros arquivos
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
