// produtos.js
import { db } from './firebase-config.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

async function carregarProdutos() {
  const lista = document.getElementById('lista-produtos');
  lista.innerHTML = '';

  try {
    const produtosRef = collection(db, 'produtos');
    const q = query(produtosRef, orderBy('criadoEm', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      lista.innerHTML = '<li>Nenhum produto disponível.</li>';
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
      `;
      lista.appendChild(li);
    });

  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
    lista.innerHTML = '<li>Erro ao carregar produtos.</li>';
  }
}

carregarProdutos();
