// admin.js
import { db } from './config.js';
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Referências
const form = document.getElementById('form-produto');
const lista = document.getElementById('lista-produtos');
const btnLogout = document.getElementById('btn-logout');

// Substitui o input file por um prompt para colar URL da imagem
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const preco = parseFloat(document.getElementById('preco').value);
  const descricao = document.getElementById('descricao').value;
  const imagemUrl = prompt("Cole o link da imagem do produto:");

  if (!imagemUrl || !imagemUrl.startsWith('http')) {
    alert("URL inválida. Produto não cadastrado.");
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

  } catch (err) {
    console.error("Erro ao cadastrar produto:", err);
    alert("Erro ao cadastrar. Verifique o console.");
  }
});

// Carrega os produtos existentes
async function carregarProdutos() {
  lista.innerHTML = '';
  const snapshot = await getDocs(collection(db, 'produtos'));

  snapshot.forEach(docSnap => {
    const p = docSnap.data();
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${p.nome}</strong><br>
      R$ ${p.preco?.toFixed(2)}<br>
      ${p.descricao}<br>
      <img src="${p.imagemUrl}" alt="${p.nome}" />
      <button onclick="deletarProduto('${docSnap.id}')">Excluir</button>
    `;
    lista.appendChild(li);
  });
}

// Deletar produto
window.deletarProduto = async (id) => {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    await deleteDoc(doc(db, 'produtos', id));
    carregarProdutos();
  }
};

// Logout
btnLogout.addEventListener('click', () => {
  window.location.href = 'login.html';
});

// Inicial
carregarProdutos();
