import { db, auth } from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Referência à coleção de produtos
const produtosCollection = collection(db, 'produtos');

// Máscara reversa para o campo de preço
const precoInput = document.getElementById('preco');
let valorNumerico = '';

precoInput.addEventListener('input', () => {
  // Remove tudo que não for número
  valorNumerico = precoInput.value.replace(/\D/g, '');

  if (valorNumerico === '') {
    precoInput.value = '';
    return;
  }

  const numero = parseFloat(valorNumerico) / 100;
  const formatado = numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  precoInput.value = formatado;
});

// Cadastro do produto
const form = document.getElementById('form-produto');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const descricao = document.getElementById('descricao').value;
  const imagemUrl = document.getElementById('imagemUrl').value;

  // Limpa o valor formatado e converte para número
  const precoFormatado = precoInput.value.replace(/\./g, '').replace(',', '.');
  const preco = parseFloat(precoFormatado);

  try {
    await addDoc(produtosCollection, {
      nome,
      preco,
      descricao,
      imagemUrl
    });

    form.reset();
    valorNumerico = '';
    listarProdutos();
  } catch (error) {
    console.error("Erro ao cadastrar produto: ", error);
  }
});

// Listagem de produtos
async function listarProdutos() {
  const lista = document.getElementById('lista-produtos');
  lista.innerHTML = '';

  const querySnapshot = await getDocs(produtosCollection);
  querySnapshot.forEach((docItem) => {
    const data = docItem.data();

    // Formata o preço para exibição
    const precoFormatado = data.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${data.nome}</strong><br>
      ${precoFormatado}<br>
      ${data.descricao}<br>
      <img src="${data.imagemUrl}" alt="${data.nome}">
      <br><button data-id="${docItem.id}">Excluir</button>
    `;

    li.querySelector('button').addEventListener('click', async () => {
      await deleteDoc(doc(produtosCollection, docItem.id));
      listarProdutos();
    });

    lista.appendChild(li);
  });
}

// Logout
document.getElementById('btn-logout').addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'login.html';
});

// Inicializa a listagem ao carregar a página
listarProdutos();
