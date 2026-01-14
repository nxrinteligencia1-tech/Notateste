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

    const notas = keys.map(k => ({ key: k, ...JSON.parse(localStorage.getItem(k)) }))
                     .sort((a,b) => new Date(b.data) - new Date(a.data));

    if (notas.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:2rem;">Nenhuma nota salva</p>';
        return;
    }

    notas.forEach(nota => {
        const item = document.createElement('div');
        item.className = 'nota-item-container';
        
        const isExpandida = notaExpandidaKey === nota.key;

        item.innerHTML = `
            <div class="nota-resumo" onclick="toggleExpandir('${nota.key}')">
                <h3>${nota.titulo}</h3>
                <p>${nota.nota}</p>
                <small style="color:#6b7280; font-size:0.7rem">${new Date(nota.data).toLocaleString()}</small>
            </div>
            ${isExpandida ? `
                <div class="nota-detalhe">
                    <div class="preview-text">${nota.nota}</div>
                    <div class="detalhe-btns">
                        <button onclick="editarNota('${nota.key}')" class="btn-blue"><i data-lucide="edit"></i> Editar</button>
                        <button onclick="copiarTexto('${nota.key}')" class="btn-green"><i data-lucide="copy"></i> Copiar</button>
                        <button onclick="deletarNota('${nota.key}')" class="btn-red"><i data-lucide="trash-2"></i></button>
                    </div>
                </div>
            ` : ''}
        `;
        listContainer.appendChild(item);
    });
    lucide.createIcons();
}

window.toggleExpandir = (key) => {
    notaExpandidaKey = (notaExpandidaKey === key) ? null : key;
    carregarLista();
};

window.editarNota = (key) => {
    const dados = JSON.parse(localStorage.getItem(key));
    titleInput.value = dados.titulo;
    noteArea.value = dados.nota;
    editandoKey = key;
    modal.style.display = 'none';
};

window.copiarTexto = async (key) => {
    const dados = JSON.parse(localStorage.getItem(key));
    await navigator.clipboard.writeText(dados.nota);
    alert('Texto copiado!');
};

window.deletarNota = (key) => {
    if (confirm('Deletar nota permanentemente?')) {
        localStorage.removeItem(key);
        if (editandoKey === key) { editandoKey = null; titleInput.value = ''; noteArea.value = ''; }
        carregarLista();
    }
};

document.getElementById('save-app-btn').onclick = () => {
    if (!titleInput.value.trim()) return alert('Título obrigatório');
    const id = editandoKey || `nota-${Date.now()}`;
    const dados = { titulo: titleInput.value, nota: noteArea.value, data: new Date().toISOString() };
    localStorage.setItem(id, JSON.stringify(dados));
    editandoKey = null;
    alert('Nota salva com sucesso!');
    carregarLista();
};

document.getElementById('new-btn').onclick = () => {
    if (titleInput.value || noteArea.value) {
        if (confirm('Criar nova nota e descartar atual?')) {
            titleInput.value = ''; noteArea.value = ''; editandoKey = null;
        }
    }
};

document.getElementById('show-saved-btn').onclick = () => { modal.style.display = 'flex'; carregarLista(); };
document.getElementById('close-modal').onclick = () => modal.style.display = 'none';

// Exportações
document.getElementById('download-txt').onclick = () => baixar(titleInput.value || 'nota', noteArea.value, 'text/plain', 'txt');
document.getElementById('download-doc').onclick = () => baixar(titleInput.value || 'nota', noteArea.value, 'application/msword', 'doc');
document.getElementById('download-pdf').onclick = () => {
    const doc = new jspdf.jsPDF();
    const texto = (titleInput.value ? titleInput.value + '\n\n' : '') + noteArea.value;
    const linhas = doc.splitTextToSize(texto, 180);
    doc.text(linhas, 15, 15);
    doc.save(`${titleInput.value || 'nota'}.pdf`);
};

function baixar(nome, conteudo, tipo, ext) {
    const blob = new Blob([conteudo], { type: tipo });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${nome}.${ext}`;
    a.click();
}

document.getElementById('copy-btn').onclick = async () => {
    if (!noteArea.value) return;
    await navigator.clipboard.writeText(noteArea.value);
    const span = document.querySelector('.btn-green span');
    span.innerText = 'OK';
    setTimeout(() => span.innerText = 'Copiar', 2000);
};

document.getElementById('clear-btn').onclick = () => {
    if (confirm('Limpar editor atual?')) { titleInput.value = ''; noteArea.value = ''; editandoKey = null; }
};

carregarLista();

