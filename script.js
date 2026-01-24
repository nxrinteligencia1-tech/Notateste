const el = id => document.getElementById(id);

let currentFile = null;

el('selectPdfBtn').onclick = () => {
  el('fileInput').click();
};

el('fileInput').addEventListener('change', e => {
  currentFile = e.target.files[0];
  if (!currentFile) return;

  el('fileName').textContent = currentFile.name;
  el('fileInfo').classList.remove('hidden');

  const url = URL.createObjectURL(currentFile);
  const viewer = el('pdfViewer');

  viewer.src = url;
  viewer.classList.remove('hidden');
});