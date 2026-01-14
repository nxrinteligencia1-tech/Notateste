lucide.createIcons();

const titleInput = document.getElementById('note-title');
const noteArea = document.getElementById('note-area');

// Carregar nota salva
window.onload = () => {
    const salva = localStorage.getItem('nota-atual');
    if (salva) {
        const dados = JSON.parse(salva);
        titleInput.value = dados.titulo || '';
        noteArea.value = dados.nota || '';
    }
};

// Botão Nova Nota
document.getElementById('new-btn').onclick = () => {
    if (titleInput.value || noteArea.value) {
        if (confirm('Descartar nota atual e criar nova?')) {
            titleInput.value = '';
            noteArea.value = '';
        }
    }
};

// Salvar no Navegador
document.getElementById('save-app-btn').onclick = () => {
    const dados = { titulo: titleInput.value, nota: noteArea.value };
    localStorage.setItem('nota-atual', JSON.stringify(dados));
    alert('Nota salva no app!');
};

// Exportar TXT
document.getElementById('download-txt').onclick = () => {
    const conteudo = titleInput.value ? `${titleInput.value}\n\n${noteArea.value}` : noteArea.value;
    const blob = new Blob([conteudo], { type: 'text/plain' });
    baixarArquivo(blob, titleInput.value ? `${titleInput.value}.txt` : 'nota.txt');
};

// Exportar DOC
document.getElementById('download-doc').onclick = () => {
    const conteudo = titleInput.value ? `${titleInput.value}\n\n${noteArea.value}` : noteArea.value;
    const blob = new Blob([conteudo], { type: 'application/msword' });
    baixarArquivo(blob, titleInput.value ? `${titleInput.value}.doc` : 'nota.doc');
};

// Exportar PDF
document.getElementById('download-pdf').onclick = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const conteudo = titleInput.value ? `${titleInput.value}\n\n${noteArea.value}` : noteArea.value;
    const linhas = doc.splitTextToSize(conteudo, 180);
    doc.text(linhas, 15, 15);
    doc.save(titleInput.value ? `${titleInput.value}.pdf` : 'nota.pdf');
};

// Auxiliar de download
function baixarArquivo(blob, nome) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nome;
    a.click();
    URL.revokeObjectURL(url);
}

// Copiar Texto
document.getElementById('copy-btn').onclick = async () => {
    try {
        await navigator.clipboard.writeText(noteArea.value);
        const span = document.querySelector('.btn-green span');
        span.innerText = 'OK';
        setTimeout(() => span.innerText = 'Copiar', 2000);
    } catch (err) { alert('Erro ao copiar'); }
};

// Limpar Tudo
document.getElementById('clear-btn').onclick = () => {
    if (confirm('Limpar tudo?')) {
        titleInput.value = '';
        noteArea.value = '';
        localStorage.removeItem('nota-atual');
    }
};

