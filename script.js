lucide.createIcons();

const html = document.documentElement;
const titleInput = document.getElementById('note-title');
const noteArea = document.getElementById('note-area');
const modal = document.getElementById('modal-saved');

let editandoKey = null;
let notaAbertaKey = null;

/* ===== TEMA ===== */
const temaSalvo = localStorage.getItem('tema');
if (temaSalvo) html.setAttribute('data-theme', temaSalvo);

document.getElementById('theme-btn').onclick = () => {
const atual = html.getAttribute('data-theme');
const novo = atual === 'dark' ? 'light' : 'dark';
html.setAttribute('data-theme', novo);
localStorage.setItem('tema', novo);
};

/* ===== LISTA ===== */
function carregarLista() {
const list = document.getElementById('saved-list');
const label = document.getElementById('count-label');
const keys = Object.keys(localStorage).filter(k => k.startsWith('nota-'));

label.innerText = `Salvas (${keys.length})`;
list.innerHTML = '';

if (!keys.length) {
list.innerHTML = '<p style="text-align:center;color:#9ca3af">Nenhuma nota salva</p>';
return;
}

keys.sort((a,b)=>b.localeCompare(a)).forEach(key=>{
const n = JSON.parse(localStorage.getItem(key));
const aberta = notaAbertaKey === key;

const item = document.createElement('div');
item.className = 'nota-item';

item.innerHTML = `
<div class="nota-resumo" onclick="abrirNota('${key}')">
<h3>${n.titulo}</h3>
</div>

${aberta ? `
<div class="nota-detalhe">
<div class="nota-texto">${n.nota}</div>
<div class="nota-acoes">
<button class="btn-blue" onclick="editarNota('${key}')">Editar</button>
<button class="btn-green" onclick="copiarNota('${key}')">Copiar</button>
<button class="btn-red" onclick="apagarNota('${key}')">Apagar</button>
</div>
</div>
` : ''}
`;

list.appendChild(item);
});

lucide.createIcons();
}

window.abrirNota = key => {
notaAbertaKey = notaAbertaKey === key ? null : key;
carregarLista();
};

window.editarNota = key => {
const n = JSON.parse(localStorage.getItem(key));
titleInput.value = n.titulo;
noteArea.value = n.nota;
editandoKey = key;
modal.style.display = 'none';
};

window.copiarNota = async key => {
const n = JSON.parse(localStorage.getItem(key));
await navigator.clipboard.writeText(n.nota);
};

window.apagarNota = key => {
if (confirm('Apagar esta nota?')) {
localStorage.removeItem(key);
notaAbertaKey = null;
carregarLista();
}
};

/* ===== SALVAR ===== */
document.getElementById('save-app-btn').onclick = () => {
if (!titleInput.value.trim()) return alert('Título obrigatório');
const id = editandoKey || `nota-${Date.now()}`;
localStorage.setItem(id, JSON.stringify({
titulo: titleInput.value,
nota: noteArea.value,
data: new Date().toISOString()
}));
editandoKey = null;
carregarLista();
};

/* ===== BOTÕES ===== */
document.getElementById('new-btn').onclick = () => {
titleInput.value = '';
noteArea.value = '';
editandoKey = null;
};

document.getElementById('show-saved-btn').onclick = () => {
modal.style.display = 'flex';
carregarLista();
};

document.getElementById('close-modal').onclick = () => modal.style.display = 'none';

document.getElementById('copy-btn').onclick = async () => {
await navigator.clipboard.writeText(noteArea.value);
};

document.getElementById('paste-btn').onclick = async () => {
const t = await navigator.clipboard.readText();
noteArea.value += t;
};

document.getElementById('clear-btn').onclick = () => {
if (confirm('Limpar tudo?')) {
titleInput.value = '';
noteArea.value = '';
editandoKey = null;
}
};

/* ===== EXPORTAR ===== */
document.getElementById('download-txt').onclick = () => baixar('nota', noteArea.value, 'text/plain', 'txt');
document.getElementById('download-doc').onclick = () => baixar('nota', noteArea.value, 'application/msword', 'doc');
document.getElementById('download-pdf').onclick = () => {
const doc = new jspdf.jsPDF();
doc.text(noteArea.value, 10, 10);
doc.save('nota.pdf');
};

function baixar(nome, conteudo, tipo, ext) {
const blob = new Blob([conteudo], { type: tipo });
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = `${nome}.${ext}`;
a.click();
}

carregarLista();