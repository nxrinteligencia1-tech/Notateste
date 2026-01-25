const { jsPDF } = window.jspdf;

let tela = 'nova';
let tema = 'dark';
let notas = JSON.parse(localStorage.getItem('notas')) || [];
let notaAtual = { titulo:'', conteudo:'' };
let expandida = null;
let editando = null;

const app = document.getElementById('app');

function salvarLocal() {
  localStorage.setItem('notas', JSON.stringify(notas));
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

function render() {
  document.body.className = tema;

  app.innerHTML = `
    <h1>Notas</h1>

    <div class="buttons">
      <button class="btn-nova" onclick="tela='nova';render()">Nova</button>
      <button class="btn-salvas" onclick="tela='salvas';render()">Salvas (${notas.length})</button>
      <button class="btn-copiar" onclick="copiar()">Copiar</button>
      <button class="btn-colar" onclick="colar()">Colar</button>
      <button onclick="tema = tema==='dark'?'light':'dark';render()">Tema</button>
    </div>

    ${tela==='nova' ? novaNota() : listaNotas()}
  `;

  const ta = document.querySelector('textarea');
  if (ta) autoResize(ta);
}

function novaNota() {
  return `
    <button class="btn-salvar" onclick="salvarNota()">Salvar</button>

    <div class="buttons">
      <button class="btn-txt" onclick="baixarTXT()">TXT</button>
      <button class="btn-doc" onclick="baixarDOC()">DOC</button>
      <button class="btn-pdf" onclick="baixarPDF()">PDF</button>
    </div>

    <input placeholder="Título"
      value="${notaAtual.titulo}"
      oninput="notaAtual.titulo=this.value">

    <textarea placeholder="Conteúdo"
      oninput="notaAtual.conteudo=this.value;autoResize(this)">${notaAtual.conteudo}</textarea>
  `;
}

function listaNotas() {
  if (!notas.length) return '<p>Nenhuma nota salva</p>';

  return notas.map((n,i)=>`
    <div class="card">
      <div onclick="toggle(${i})"><strong>${n.titulo}</strong></div>
      <small>${n.data}</small>

      ${expandida===i ? `
        <div class="card-content">
          ${editando===i ? `
            <textarea oninput="notas[${i}].conteudo=this.value;autoResize(this)">${n.conteudo}</textarea>
            <button class="btn-salvar" onclick="salvarEdicao(${i})">Salvar</button>
          ` : `
            ${n.conteudo}
            <div class="buttons">
              <button class="btn-editar" onclick="editar(${i})">Editar</button>
              <button class="btn-del" onclick="deletar(${i})">Excluir</button>
            </div>
          `}
        </div>
      ` : ''}
    </div>
  `).join('');
}

function salvarNota() {
  if (!notaAtual.titulo.trim()) return alert('Título obrigatório');

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
  editando = i;
  render();
}

function salvarEdicao(i) {
  salvarLocal();
  editando = null;
  render();
}

function deletar(i) {
  if (confirm('Excluir nota?')) {
    notas.splice(i,1);
    salvarLocal();
    render();
  }
}

function toggle(i) {
  expandida = expandida === i ? null : i;
  editando = null;
  render();
}

function copiar() {
  navigator.clipboard.writeText(notaAtual.conteudo);
  alert('Copiado');
}

async function colar() {
  try {
    const texto = await navigator.clipboard.readText();
    notaAtual.conteudo += texto;
    render();
  } catch {
    alert('Permissão negada');
  }
}

/* EXPORTAÇÕES */
function baixarTXT() { downloadArquivo('txt'); }
function baixarDOC() { downloadArquivo('doc'); }

function baixarPDF() {
  if (!notaAtual.titulo) return alert('Crie a nota');
  const pdf = new jsPDF();
  pdf.text(notaAtual.titulo, 10, 15);
  pdf.text(notaAtual.conteudo, 10, 30, { maxWidth: 180 });
  pdf.save(`${notaAtual.titulo}.pdf`);
}

function downloadArquivo(ext) {
  if (!notaAtual.titulo) return alert('Crie a nota');
  const texto = `${notaAtual.titulo}\n\n${notaAtual.conteudo}`;
  const blob = new Blob([texto], { type:'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${notaAtual.titulo}.${ext}`;
  a.click();
}

render();