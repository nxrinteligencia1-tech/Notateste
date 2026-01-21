lucide.createIcons();

const titleInput = document.getElementById('note-title');
const noteArea = document.getElementById('note-area');
const modal = document.getElementById('modal-saved');
let editandoKey = null;
let notaExpandidaKey = null;

function carregarLista() {
    const listContainer = document.getElementById('saved-list');
    const label = document.getElementById('count-label');
    const keys = Object.keys(localStorage).filter(k => k.startsWith('nota-'));

    label.innerText = `Salvas (${keys.length})`;
    listContainer.innerHTML = '';

    if (!keys.length) {
        listContainer.innerHTML = '<p style="text-align:center;color:#9ca3af">Nenhuma nota salva</p>';
        return;
    }

    keys.sort((a,b)=>b.localeCompare(a)).forEach(key=>{
        const n = JSON.parse(localStorage.getItem(key));
        const div = document.createElement('div');
        div.innerHTML = `<strong>${n.titulo}</strong><br><small>${n.nota}</small>`;
        listContainer.appendChild(div);
    });
}

document.getElementById('save-app-btn').onclick = () => {
    if (!titleInput.value.trim()) return alert('Título obrigatório');
    const id = editandoKey || `nota-${Date.now()}`;
    localStorage.setItem(id, JSON.stringify({
        titulo: titleInput.value,
        nota: noteArea.value,
        data: new Date().toISOString()
    }));
    alert('Nota salva');
    carregarLista();
};

document.getElementById('copy-btn').onclick = async () => {
    if (!noteArea.value) return;
    await navigator.clipboard.writeText(noteArea.value);
};

document.getElementById('paste-btn').onclick = async () => {
    try {
        const texto = await navigator.clipboard.readText();
        if (texto) noteArea.value += texto;
        else alert('Nada para colar');
    } catch {
        alert('Permissão negada');
    }
};

document.getElementById('clear-btn').onclick = () => {
    if (confirm('Limpar tudo?')) {
        titleInput.value = '';
        noteArea.value = '';
        editandoKey = null;
    }
};

document.getElementById('show-saved-btn').onclick = () => {
    modal.style.display = 'flex';
    carregarLista();
};

document.getElementById('close-modal').onclick = () => {
    modal.style.display = 'none';
};

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