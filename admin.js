import { db, auth } from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Referência à coleção de produtos
const produtosCollection = collection(db, 'produtos');

// Variável de controle para edição
let idProdutoEditando = null;

// Máscara reversa para o campo de preço
const precoInput = document.getElementById('preco');
let valorNumerico = '';

precoInput.addEventListener('input', () => {
  valorNumerico = precoInput.value.replace(/\D/g, '');
  if (valorNumerico === '') {
    precoInput.value = '';
    return;
  }
  const numero = parseFloat(valorNumerico) / 100;
  const formatado = numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  precoInput.value = formatado;
});

// Função para preencher o formulário ao editar
function preencherFormularioEdicao(id, data) {
  document.getElementById('nome').value = data.nome;
  document.getElementById('descricao').value = data.descricao;
  document.getElementById('imagemUrl').value = data.imagemUrl;
  document.getElementById('preco').value = data.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  valorNumerico = (data.preco * 100).toFixed(0);
  idProdutoEditando = id;
  document.querySelector('button[type="submit"]').textContent = 'Salvar Alterações';
}

// Cadastro e edição de produto
const form = document.getElementById('form-produto');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const descricao = document.getElementById('descricao').value;
  const imagemUrl = document.getElementById('imagemUrl').value;
  const precoFormatado = precoInput.value.replace(/\./g, '').replace(',', '.');
  const preco = parseFloat(precoFormatado);

  try {
    if (idProdutoEditando) {
      const produtoDoc = doc(produtosCollection, idProdutoEditando);
      await updateDoc(produtoDoc, {
        nome,
        preco,
        descricao,
        imagemUrl
      });
      idProdutoEditando = null;
      document.querySelector('button[type="submit"]').textContent = 'Cadastrar';
    } else {
      await addDoc(produtosCollection, {
        nome,
        preco,
        descricao,
        imagemUrl,
        criadoEm: new Date()
      });
    }

    form.reset();
    valorNumerico = '';
    listarProdutos();
  } catch (error) {
    console.error("Erro ao salvar produto: ", error);
  }
});

// Listagem de produtos
async function listarProdutos() {
  const lista = document.getElementById('lista-produtos');
  lista.innerHTML = '';

  const querySnapshot = await getDocs(produtosCollection);
  querySnapshot.forEach((docItem) => {
    const data = docItem.data();
    const precoFormatado = data.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${data.nome}</strong><br>
      ${precoFormatado}<br>
      ${data.descricao}<br>
      <img src="${data.imagemUrl}" alt="${data.nome}">
      <br>
      <button data-id="${docItem.id}" class="btn-excluir">Excluir</button>
      <button data-id="${docItem.id}" class="btn-editar">Editar</button>
    `;

    // Botão excluir
    li.querySelector('.btn-excluir').addEventListener('click', async () => {
      await deleteDoc(doc(produtosCollection, docItem.id));
      listarProdutos();
    });

    // Botão editar
    li.querySelector('.btn-editar').addEventListener('click', () => {
      preencherFormularioEdicao(docItem.id, data);
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
