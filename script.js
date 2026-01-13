lucide.createIcons();

const titleInput = document.getElementById('note-title');
const noteArea = document.getElementById('note-area');

// Carregar nota salva ao abrir
window.addEventListener('DOMContentLoaded', () => {
    const salva = localStorage.getItem('nota-atual');
    if (salva) {
        const dados = JSON.parse(salva);
        titleInput.value = dados.titulo || '';
        noteArea.value = dados.nota || '';
    }
});

// Salvar no Navegador
document.getElementById('save-app-btn').onclick = () => {
    const dados = { titulo: titleInput.value, nota: noteArea.value };
    localStorage.setItem('nota-atual', JSON.stringify(dados));
    alert('Nota salva na memória do navegador!');
};

// Baixar TXT
document.getElementById('download-btn').onclick = () => {
    const conteudo = titleInput.value ? `${titleInput.value}\n\n${noteArea.value}` : noteArea.value;
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = titleInput.value ? `${titleInput.value}.txt` : 'nota.txt';
    a.click();
    URL.revokeObjectURL(url);
};

// Copiar Texto
document.getElementById('copy-btn').onclick = async () => {
    try {
        await navigator.clipboard.writeText(noteArea.value);
        const btnText = document.querySelector('.btn-copy span');
        btnText.innerText = 'Copiado!';
        setTimeout(() => btnText.innerText = 'Copiar', 2000);
    } catch (err) {
        alert('Erro ao copiar');
    }
};

// Limpar Tudo
document.getElementById('clear-btn').onclick = () => {
    if (confirm('Limpar tudo?')) {
        titleInput.value = '';
        noteArea.value = '';
        localStorage.removeItem('nota-atual');
    }
};

