lucide.createIcons();
const titleInput = document.getElementById('note-title');
const noteArea = document.getElementById('note-area');
const modal = document.getElementById('modal-saved');

// Carregar Lista do LocalStorage
function carregarLista() {
    const listContainer = document.getElementById('saved-list');
    const label = document.getElementById('count-label');
    listContainer.innerHTML = '';
    
    const notas = JSON.parse(localStorage.getItem('minhas-notas-v3') || '[]');
    label.innerText = `Salvas (${notas.length})`;

    if (notas.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center;color:#666">Nenhuma nota salva</p>';
        return;
    }

    notas.sort((a,b) => new Date(b.data) - new Date(a.data)).forEach((nota, index) => {
        const div = document.createElement('div');
        div.className = 'nota-item';
        div.innerHTML = `
            <div class="nota-info" onclick="abrirNota(${index})">
                <h3>${nota.titulo}</h3>
                <p>${new Date(nota.data).toLocaleString('pt-BR')}</p>
            </div>
            <button onclick="deletarNota(${index})" class="btn-red" style="padding:0.3rem"><i data-lucide="trash-2"></i></button>
        `;
        listContainer.appendChild(div);
    });
    lucide.createIcons();
}

window.abrirNota = (index) => {
    const notas = JSON.parse(localStorage.getItem('minhas-notas-v3') || '[]');
    titleInput.value = notas[index].titulo;
    noteArea.value = notas[index].nota;
    modal.style.display = 'none';
};

window.deletarNota = (index) => {
    if (confirm('Deletar esta nota?')) {
        let notas = JSON.parse(localStorage.getItem('minhas-notas-v3') || '[]');
        notas.splice(index, 1);
        localStorage.setItem('minhas-notas-v3', JSON.stringify(notas));
        carregarLista();
    }
};

document.getElementById('save-app-btn').onclick = () => {
    if (!titleInput.value.trim()) return alert('Dê um título à nota!');
    let notas = JSON.parse(localStorage.getItem('minhas-notas-v3') || '[]');
    notas.push({
        titulo: titleInput.value,
        nota: noteArea.value,
        data: new Date().toISOString()
    });
    localStorage.setItem('minhas-notas-v3', JSON.stringify(notas));
    alert('Nota salva na lista!');
    carregarLista();
};

document.getElementById('show-saved-btn').onclick = () => {
    modal.style.display = 'flex';
    carregarLista();
};
document.getElementById('close-modal').onclick = () => modal.style.display = 'none';

// Exportações (TXT, DOC, PDF)
document.getElementById('download-txt').onclick = () => baixar(titleInput.value || 'nota', noteArea.value, 'text/plain', 'txt');
document.getElementById('download-doc').onclick = () => baixar(titleInput.value || 'nota', noteArea.value, 'application/msword', 'doc');
document.getElementById('download-pdf').onclick = () => {
    const doc = new jspdf.jsPDF();
    const linhas = doc.splitTextToSize(noteArea.value, 180);
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

document.getElementById('new-btn').onclick = () => {
    if (confirm('Criar nova nota?')) { titleInput.value = ''; noteArea.value = ''; }
};

carregarLista();

