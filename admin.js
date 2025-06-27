import { db, auth } from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const produtosCollection = collection(db, 'produtos');

let idProdutoEditando = null;

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

// 🔧 NOVA FUNÇÃO: formata o link do Google Drive
function formatarLinkDrive(url) {
  const match = url.match(/\/d\/(.+?)\//);
  if (match) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url; // Se não for link do Drive, mantém original
}

function preencherFormularioEdicao(id, data) {
  document.getElementById('nome').value = data.nome;
  document.getElementById('descricao').value = data.descricao;
  document.getElementById('imagemUrl').value = data.imagemUrl;
  document.getElementById('preco').value = data.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  valorNumerico = (data.preco * 100).toFixed(0);
  idProdutoEditando = id;
  document.querySelector('button[type="submit"]').textContent = 'Salvar Alterações';
}

const form = document.getElementById('form-produto');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const descricao = document.getElementById('descricao').value;
  const imagemOriginal = document.getElementById('imagemUrl').value;

  // ✅ Aqui usamos a função para corrigir o link do Google Drive
  const imagemUrl = formatarLinkDrive(imagemOriginal);

  const precoFormatado = precoInput.value.replace(/\./g, '').replace(',', '.');
  const preco = parseFloat(precoFormatado);

  try {
    if (idProdutoEditando) {
      const produtoDoc = doc(produtosCollection, idProdutoEditando);
      await updateDoc(produtoDoc, {
        nome,
        preco,
        descricao,
        imagemUrl // 🔄 usando o link formatado
      });
      idProdutoEditando = null;
      document.querySelector('button[type="submit"]').textContent = 'Cadastrar';
    } else {
      await addDoc(produtosCollection, {
        nome,
        preco,
        descricao,
        imagemUrl, // 🔄 usando o link formatado
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

    li.querySelector('.btn-excluir').addEventListener('click', async () => {
      await deleteDoc(doc(produtosCollection, docItem.id));
      listarProdutos();
    });

    li.querySelector('.btn-editar').addEventListener('click', () => {
      preencherFormularioEdicao(docItem.id, data);
    });

    lista.appendChild(li);
  });
}

document.getElementById('btn-logout').addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'login.html';
});

listarProdutos();
