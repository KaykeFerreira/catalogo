import { db } from './firebase-config.js';
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const catalogoDiv = document.getElementById('catalogo');

// Consulta os produtos ordenados por data de criação (mais recentes primeiro)
const produtosQuery = query(collection(db, 'produtos'), orderBy('criadoEm', 'desc'));

// Atualiza em tempo real o catálogo
onSnapshot(produtosQuery, (snapshot) => {
  catalogoDiv.innerHTML = ''; // Limpa catálogo

  if (snapshot.empty) {
    catalogoDiv.innerHTML = '<p>Nenhum produto disponível no momento.</p>';
    return;
  }

  snapshot.forEach(doc => {
    const p = doc.data();

    // Cria o card do produto
    const produtoCard = document.createElement('div');
    produtoCard.classList.add('produto-card');

    produtoCard.innerHTML = `
      <h3>${p.nome}</h3>
      ${p.imagemUrl ? `<img src="${p.imagemUrl}" alt="${p.nome}" />` : ''}
      <p><strong>Preço:</strong> R$ ${p.preco.toFixed(2)}</p>
      <p>${p.descricao || ''}</p>
    `;

    catalogoDiv.appendChild(produtoCard);
  });
});
