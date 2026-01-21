lucide.createIcons();

const themeBtn = document.getElementById('theme-btn');
const html = document.documentElement;

const temaSalvo = localStorage.getItem('tema');
if (temaSalvo) html.setAttribute('data-theme', temaSalvo);

themeBtn.onclick = () => {
    const atual = html.getAttribute('data-theme');
    const novo = atual === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', novo);
    localStorage.setItem('tema', novo);
};

document.getElementById('copy-btn').onclick = async () => {
    await navigator.clipboard.writeText(
        document.getElementById('note-area').value
    );
};

document.getElementById('paste-btn').onclick = async () => {
    const texto = await navigator.clipboard.readText();
    document.getElementById('note-area').value += texto;
};