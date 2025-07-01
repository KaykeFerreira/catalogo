// admin.js com suporte a upload via Appwrite
import { auth } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import { Client, Storage, Databases, ID } from "https://cdn.jsdelivr.net/npm/appwrite@13.0.0/+esm";

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("6864128900221c71533b");

const storage = new Storage(client);
const databases = new Databases(client);
const bucketId = "68643c6f0026c7bd6385";
const databaseId = "catalogo_db";
const collectionId = "produtos";

let idProdutoEditando = null;
let valorNumerico = '';

const precoInput = document.getElementById('preco');
precoInput.addEventListener('input', () => {
  valorNumerico = precoInput.value.replace(/\D/g, '');
  if (valorNumerico === '') {
    precoInput.value = '';
    return;
  }
  const numero = parseFloat(valorNumerico) / 100;
  precoInput.value = numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
});

function preencherFormularioEdicao(doc) {
  document.getElementById('nome').value = doc.nome;
  document.getElementById('descricao').value = doc.descricao;
  document.getElementById('preco').value = doc.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  valorNumerico = (doc.preco * 100).toFixed(0);
  idProdutoEditando = doc.$id;
  document.querySelector('button[type="submit"]').textContent = 'Salvar Alterações';
}

const form = document.getElementById('form-produto');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const descricao = document.getElementById('descricao').value;
  const precoFormatado = precoInput.value.replace(/\./g, '').replace(',', '.');
  const preco = parseFloat(precoFormatado);

  const imagemArquivo = document.getElementById('imagemArquivo').files[0];
  if (!imagemArquivo) return alert("Selecione uma imagem");

  try {
    let imagemId;
    if (!idProdutoEditando || imagemArquivo) {
      const uploadResponse = await storage.createFile(bucketId, ID.unique(), imagemArquivo);
      imagemId = uploadResponse.$id;
    }

    const imageUrl = storage.getFilePreview(bucketId, imagemId);

    if (idProdutoEditando) {
      await databases.updateDocument(databaseId, collectionId, idProdutoEditando, {
        nome,
        preco,
        descricao,
        imagemUrl: imageUrl.href
      });
      idProdutoEditando = null;
      document.querySelector('button[type="submit"]').textContent = 'Cadastrar';
    } else {
      await databases.createDocument(databaseId, collectionId, ID.unique(), {
        nome,
        preco,
        descricao,
        imagemUrl: imageUrl.href,
        criadoEm: new Date().toISOString()
      });
    }

    form.reset();
    valorNumerico = '';
    listarProdutos();
  } catch (error) {
    console.error("Erro ao salvar produto:", error);
  }
});

async function listarProdutos() {
  const lista = document.getElementById('lista-produtos');
  lista.innerHTML = '';

  try {
    const res = await databases.listDocuments(databaseId, collectionId);
    res.documents.forEach((doc) => {
      const precoFormatado = doc.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${doc.nome}</strong><br>
        ${precoFormatado}<br>
        ${doc.descricao}<br>
        <img src="${doc.imagemUrl}" alt="${doc.nome}">
        <br>
        <button data-id="${doc.$id}" class="btn-excluir">Excluir</button>
        <button data-id="${doc.$id}" class="btn-editar">Editar</button>
      `;

      li.querySelector('.btn-excluir').addEventListener('click', async () => {
        await databases.deleteDocument(databaseId, collectionId, doc.$id);
        listarProdutos();
      });

      li.querySelector('.btn-editar').addEventListener('click', () => {
        preencherFormularioEdicao(doc);
      });

      lista.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
  }
}

listarProdutos();

document.getElementById('btn-logout').addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'login.html';
});
