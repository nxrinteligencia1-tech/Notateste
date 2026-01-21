lucide.createIcons();

const html = document.documentElement;
const titleInput = document.getElementById('note-title');
const noteArea = document.getElementById('note-area');
const modal = document.getElementById('modal-saved');

/* ===== TEMA ===== */
const temaSalvo = localStorage.getItem('tema');
if (temaSalvo) html.setAttribute('data-theme', temaSalvo);

document.getElementById('theme-btn').onclick = () => {
const atual = html.getAttribute('data-theme');
const novo = atual === 'dark' ? 'light' : 'dark';
html.setAttribute('data-theme', novo);
localStorage.setItem('tema', novo);
};

/* ===== NOTAS ===== */
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
const div = document.createElement('div');
div.style.marginBottom = '1rem';
div.innerHTML = `<strong>${n.titulo}</strong><p>${n.nota}</p>`;
list.appendChild(div);
});
}

document.getElementById('save-app-btn').onclick = () => {
if (!titleInput.value.trim()) return alert('Título obrigatório');
const id = `nota-${Date.now()}`;
localStorage.setItem(id, JSON.stringify({
titulo: titleInput.value,
nota: noteArea.value,
data: new Date().toISOString()
}));
alert('Nota salva');
carregarLista();
};

document.getElementById('new-btn').onclick = () => {
titleInput.value = '';
noteArea.value = '';
};

document.getElementById('show-saved-btn').onclick = () => {
modal.style.display = 'flex';
carregarLista();
};

document.getElementById('close-modal').onclick = () => {
modal.style.display = 'none';
};

/* ===== COPIAR / COLAR ===== */
document.getElementById('copy-btn').onclick = async () => {
await navigator.clipboard.writeText(noteArea.value);
};

document.getElementById('paste-btn').onclick = async () => {
const texto = await navigator.clipboard.readText();
noteArea.value += texto;
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

/* ===== LIMPAR ===== */
document.getElementById('clear-btn').onclick = () => {
if (confirm('Limpar tudo?')) {
titleInput.value = '';
noteArea.value = '';
}
};

carregarLista();