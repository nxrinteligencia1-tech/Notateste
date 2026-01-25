let tema = 'escuro';
let tela = 'nova';
let notas = JSON.parse(localStorage.getItem('notas')) || [];
let notaAtual = { titulo: '', conteudo: '' };

const app = document.getElementById('app');

function salvarLocal() {
  localStorage.setItem('notas', JSON.stringify(notas));
}

function cores() {
  return tema === 'escuro'
    ? { bg:'#1e293b', card:'#334155', texto:'#fff', btn:'#3b82f6' }
    : { bg:'#f8fafc', card:'#fff', texto:'#000', btn:'#2563eb' };
}

function render() {
  const c = cores();
  app.style.background = c.bg;
  app.style.color = c.texto;

  app.innerHTML = `
    <h1>Notas</h1>

    <div class="actions">
      <button onclick="trocarTema()">Tema</button>
      <button onclick="tela='nova';render()">Nova</button>
      <button onclick="tela='salvas';render()">Salvas (${notas.length})</button>
      <button onclick="copiar()">Copiar</button>
      <button onclick="colar()">Colar</button>
    </div>

    ${tela === 'nova' ? novaNota(c) : listaNotas(c)}
  `;
}

function novaNota(c) {
  return `
    <button onclick="salvarNota()">Salvar</button>

    <input placeholder="Título"
      value="${notaAtual.titulo}"
      oninput="notaAtual.titulo=this.value">

    <textarea placeholder="Conteúdo"
      oninput="notaAtual.conteudo=this.value">${notaAtual.conteudo}</textarea>

    <div class="actions">
      <button onclick="baixar('txt')">TXT</button>
      <button onclick="baixar('doc')">DOC</button>
      <button onclick="baixar('pdf')">PDF</button>
    </div>
  `;
}

function listaNotas(c) {
  if (!notas.length) return '<p>Nenhuma nota salva</p>';

  return notas.map((n,i)=>`
    <div class="card" style="background:${c.card}">
      <strong>${n.titulo}</strong><br>
      <small>${n.data}</small>
      <pre>${n.conteudo}</pre>
      <button onclick="editar(${i})">Editar</button>
      <button onclick="deletar(${i})">Apagar</button>
    </div>
  `).join('');
}

function salvarNota() {
  if (!notaAtual.titulo.trim()) {
    alert('Título obrigatório');
    return;
  }

  notas.unshift({
    id: Date.now(),
    titulo: notaAtual.titulo,
    conteudo: notaAtual.conteudo,
    data: new Date().toLocaleString('pt-BR')
  });

  notaAtual = { titulo:'', conteudo:'' };
  salvarLocal();
  render();
}

function editar(i) {
  notaAtual = { titulo: notas[i].titulo, conteudo: notas[i].conteudo };
  notas.splice(i,1);
  salvarLocal();
  tela = 'nova';
  render();
}

function deletar(i) {
  if (confirm('Deletar nota?')) {
    notas.splice(i,1);
    salvarLocal();
    render();
  }
}

function trocarTema() {
  tema = tema === 'escuro' ? 'claro' : 'escuro';
  render();
}

function copiar() {
  navigator.clipboard.writeText(notaAtual.conteudo);
  alert('Copiado');
}

async function colar() {
  try {
    const t = await navigator.clipboard.readText();
    notaAtual.conteudo += t;
    render();
  } catch {
    alert('Permissão negada');
  }
}

function baixar(ext) {
  if (!notaAtual.titulo) {
    alert('Crie uma nota');
    return;
  }
  const texto = `${notaAtual.titulo}\n\n${notaAtual.conteudo}`;
  const blob = new Blob([texto], { type:'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${notaAtual.titulo}.${ext}`;
  a.click();
  URL.revokeObjectURL(a.href);
}

render();