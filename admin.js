import { db, storage } from './firebase-config.js';
import { collection, addDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js';

const form = document.getElementById('form-produto');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const preco = parseFloat(document.getElementById('preco').value);
  const descricao = document.getElementById('descricao').value.trim();
  const imagemInput = document.getElementById('imagem');

  if (!imagemInput.files.length) {
    alert('Por favor, selecione uma imagem.');
    return;
  }

  const imagemFile = imagemInput.files[0];
  const storageRef = ref(storage, 'produtos/' + imagemFile.name);

  try {
    // Upload da imagem
    await uploadBytes(storageRef, imagemFile);

    // Pega a URL pública
    const imagemUrl = await getDownloadURL(storageRef);

    // Adiciona o produto no Firestore
    await addDoc(collection(db, 'produtos'), {
      nome,
      preco,
      descricao,
      imagemUrl,
      criadoEm: Timestamp.now()
    });

    alert('Produto cadastrado com sucesso!');
    form.reset();
    window.location.href = 'catalogo.html';

  } catch (err) {
    console.error("Erro ao cadastrar:", err);
    alert("Erro ao cadastrar. Veja o console.");
  }
});
