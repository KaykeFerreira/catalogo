// admin.js

// Importação do Firebase
import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// Referência à coleção "produtos" no Firestore
const produtosCollection = collection(db, 'produtos');

// Formulário de cadastro
const form = document.getElementById('form-produto');
const listaProdutos = document.getElementById('lista-produtos');

// Aplicar máscara no campo de preço enquanto digita
const precoInput = document.getElementById('preco');
precoInput.addEventListener('input', () => {
  let valor = precoInput.value.replace(/\D/g, ''); // Remove tudo que não é número
  valor = (parseFloat(valor) / 100).toFixed(2) + '';
  valor = valor.replace('.', ',');
  valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  precoInput.value = valor;
});

// Ao submeter o formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const descricao = document.getElementById('descricao').value;
  const imagemUrl = document.getElementById('imagemUrl').value;

  // Aqui fazemos a limpeza da formatação do preço
  let precoFormatado = precoInput.value;
  precoFormatado = precoFormatado.replace(/\./g, '').replace(',', '.');
  const precoNumero = parseFloat(precoFormatado);  // Agora o preço é um número puro

  try {
    await addDoc(produtosCollection, {
      nome,
      preco: precoNumero,
      descricao,
      imagemUrl
    });

    form.reset();
    listarProdutos();
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
  }
});

// Função para listar produtos já cadastrados
async function listarProdutos() {
  listaProdutos.innerHTML = '';

  const querySnapshot = await getDocs(produtosCollection);
  querySnapshot.forEach((docItem) => {
    const produto = docItem.data();

    // Formatar o preço para exibição (R$ 1.234,56)
    let precoFormatado = produto.preco.toFixed(2).toString().replace('.', ',');
    precoFormatado = precoFormatado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${produto.nome}</strong><br/>
      R$ ${precoFormatado}<br/>
      ${produto.descricao}<br/>
      <img src="${produto.imagemUrl}" alt="${produto.nome}" /><br/>
      <button onclick="removerProduto('${docItem.id}')">Remover</button>
    `;
    listaProdutos.appendChild(li);
  });
}

// Remover produto
window.removerProduto = async (id) => {
  if (confirm('Tem certeza que deseja remover este produto?')) {
    await deleteDoc(doc(produtosCollection, id));
    listarProdutos();
  }
};

// Listar produtos ao carregar a página
listarProdutos();
