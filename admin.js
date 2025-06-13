// admin.js
import { db } from './config.js';
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const form = document.getElementById('form-produto');
const lista = document.getElementById('lista-produtos');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const preco = parseFloat(document.getElementById('preco').value);
  const descricao = document.getElementById('descricao').value;
  const imagemUrl = document.getElementById('imagemUrl').value;

  try {
    await addDoc(collection(db, 'produtos'), {
      nome,
      preco,
      descricao,
      imagemUrl,
      criadoEm: serverTimestamp()
    });

    alert('Produto cadastrado com sucesso!');
    form.reset();
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    alert('Erro ao cadastrar produto. Veja o console para detalhes.');
  }
});

const produtosQuery = query(collection(db, 'produtos'), orderBy('criadoEm', 'desc'));

onSnapshot(produtosQuery, (snapshot) => {
  lista.innerHTML = '';
  snapshot.forEach(doc => {
    const p = doc.data();
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${p.nome}</strong><br>
      R$ ${p.preco.toFixed(2)}<br>
      ${p.descricao}<br>
      <img src="${p.imagemUrl}" alt="${p.nome}" />
    `;
    lista.appendChild(li);
  });
});
