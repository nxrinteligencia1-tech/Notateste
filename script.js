// Inicializar os ícones do Lucide
lucide.createIcons();

const noteArea = document.getElementById('note-area');
const saveBtn = document.getElementById('save-btn');
const clearBtn = document.getElementById('clear-btn');

// Função para Salvar a Nota como arquivo .txt
saveBtn.onclick = () => {
    const texto = noteArea.value;
    if (!texto) {
        alert("Digite algo antes de salvar!");
        return;
    }

    const blob = new Blob([texto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = 'nota.txt';
    document.body.appendChild(a);
    a.click();
    
    // Limpeza técnica
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// Função para Limpar tudo
clearBtn.onclick = () => {
    if (confirm('Tem certeza que deseja limpar tudo?')) {
        noteArea.value = '';
    }
};
