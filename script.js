const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModal");

openBtn.onclick = () => {
  modal.classList.remove("hidden");
};

function closeModal() {
  modal.classList.add("hidden");
}

function toggleNote(note) {
  note.classList.toggle("open");
}