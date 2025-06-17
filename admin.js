// admin.js

// Importação do Firebase
import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// Referência à coleção "produtos" no Firestore
const produtosCollection = collection(db, 'produtos');

// Seleção dos elementos
const form = document.getElementById('form-produto');
const listaProdutos = document.getElementById('lista-produtos');
const precoInput = document.getElementById('preco');

// Máscara de preço ao digitar
let valorAnterior = '';

precoInput.addEventListener('input', () => {
  let valor = precoInput.value.replace(/\D/g, ''); // Remove tudo que não for dígito

  if (valor === '') {
    precoInput.value = '';
    valorAnterior = '';
    return;
  }

  while (valor.length < 3) {
    valor = '0' + valor; // Garante no mínimo 3 dígitos (ex: 000 → 0,00)
  }

  const parteInteira = valor.slice(0, valor.length - 2);
  const parteDecimal = valor.slice(-2);

  let parteInteiraFormatada = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  precoInput.value = parteInteiraFormatada + ',' + parteDecimal;
  valorAnterior = precoInput.value;
});

// Envio do formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const descricao = document.getElementById('descricao').value;
  const imagemUrl = document.getElementById('imagemUrl').value;

  // Limpeza da máscara antes de enviar
  let precoFormatado = precoInput.value.replace(/\./g, '').replace(',', '.');
  const precoNumero = parseFloat(precoFormatado);

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

// Função para listar produtos cadastrados
async function listarProdutos() {
  listaProdutos.innerHTML = '';

  const querySnapshot = await getDocs(produtosCollection);
  querySnapshot.forEach((docItem) => {
    const produto = docItem.data();

    // Formatar o preço na exibição
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

// Remoção de produto
window.removerProduto = async (id) => {
  if (confirm('Tem certeza que deseja remover este produto?')) {
    await deleteDoc(doc(produtosCollection, id));
    listarProdutos();
  }
};

// Carrega produtos ao abrir a página
listarProdutos();
