console.log("Firebase App iniciado:", app);

// admin.js
import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const form = document.getElementById('form-produto');
const lista = document.getElementById('lista-produtos');
const btnLogout = document.getElementById('btn-logout');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const preco = parseFloat(document.getElementById('preco').value);
  const descricao = document.getElementById('descricao').value.trim();
  const imagemUrl = document.getElementById('imagemUrl').value.trim();

  if (!imagemUrl || !imagemUrl.startsWith('http')) {
    alert("URL da imagem inválida!");
    return;
  }

  try {
    await addDoc(collection(db, 'produtos'), {
      nome,
      preco,
      descricao,
      imagemUrl,
      criadoEm: serverTimestamp()
    });

    alert("Produto cadastrado com sucesso!");
    form.reset();
    carregarProdutos();

  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    alert("Erro ao cadastrar produto.");
  }
});

async function carregarProdutos() {
  lista.innerHTML = '';
  const produtosRef = collection(db, 'produtos');
  const q = query(produtosRef, orderBy('criadoEm', 'desc'));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    lista.innerHTML = '<li>Nenhum produto cadastrado.</li>';
    return;
  }

  snapshot.forEach(docSnap => {
    const p = docSnap.data();
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${p.nome}</strong><br>
      R$ ${p.preco?.toFixed(2)}<br>
      ${p.descricao || ''}<br>
      <img src="${p.imagemUrl}" alt="${p.nome}" />
      <button onclick="deletarProduto('${docSnap.id}')">Excluir</button>
    `;
    lista.appendChild(li);
  });
}

window.deletarProduto = async (id) => {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    try {
      await deleteDoc(doc(db, 'produtos', id));
      carregarProdutos();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto.");
    }
  }
};

btnLogout.addEventListener('click', () => {
  window.location.href = 'inicio.html';
});

carregarProdutos();
