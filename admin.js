import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, orderBy, query } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Referências de elementos
const form = document.getElementById("form-produto");
const nomeInput = document.getElementById("nome");
const precoInput = document.getElementById("preco");
const descricaoInput = document.getElementById("descricao");
const imagemInput = document.getElementById("imagem");
const listaProdutos = document.getElementById("lista-produtos");
const btnLogout = document.getElementById("btn-logout");

// Cadastrar novo produto
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = nomeInput.value;
  const preco = parseFloat(precoInput.value);
  const descricao = descricaoInput.value;
  const imagemFile = imagemInput.files[0];

  if (!imagemFile) {
    alert("Selecione uma imagem para o produto.");
    return;
  }

  try {
    const imgRef = ref(storage, `imagens/${Date.now()}_${imagemFile.name}`);
    await uploadBytes(imgRef, imagemFile);
    const imagemURL = await getDownloadURL(imgRef);

    await addDoc(collection(db, "produtos"), {
      nome,
      preco,
      descricao,
      imagemURL,
      criadoEm: new Date()
    });

    alert("Produto cadastrado com sucesso!");
    form.reset();
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    alert("Erro ao cadastrar produto. Veja o console.");
  }
});

// Listar produtos cadastrados
const produtosQuery = query(collection(db, "produtos"), orderBy("criadoEm", "desc"));
onSnapshot(produtosQuery, (snapshot) => {
  listaProdutos.innerHTML = "";
  if (snapshot.empty) {
    listaProdutos.innerHTML = "<li>Nenhum produto cadastrado.</li>";
    return;
  }

  snapshot.forEach((doc) => {
    const p = doc.data();

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${p.nome}</strong><br>
      R$ ${p.preco.toFixed(2)}<br>
      ${p.descricao || ""}<br>
      <img src="${p.imagemURL}" alt="${p.nome}" />
    `;
    listaProdutos.appendChild(li);
  });
});

// Logout (simples redirecionamento)
btnLogout.addEventListener("click", () => {
  window.location.href = "login.html";
});
