// catalogo.js
import { auth, db } from './firebase-config.js';
import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const catalogo = document.getElementById('catalogo');

async function carregarProdutos() {
  const produtosQuery = query(collection(db, 'produtos'), orderBy('criadoEm', 'desc'));
  const snapshot = await getDocs(produtosQuery);

  catalogo.innerHTML = '';
  snapshot.forEach(doc => {
    const p = doc.data();
    const card = document.createElement('div');
    card.className = 'produto-card';
    card.innerHTML = `
      <img src="${p.imagemUrl}" alt="${p.nome}" />
      <h3>${p.nome}</h3>
      <p>${p.descricao}</p>
      <p><strong>R$ ${p.preco.toFixed(2)}</strong></p>
    `;
    catalogo.appendChild(card);
  });

  if (catalogo.innerHTML === '') {
    catalogo.innerHTML = '<p>Nenhum produto cadastrado.</p>';
  }
}

carregarProdutos();

// Logout
const btnLogout = document.getElementById('btn-logout');
btnLogout.addEventListener('click', () => {
  window.location.href = 'inicio.html';
});
