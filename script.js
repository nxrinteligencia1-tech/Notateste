const modal = document.getElementById("modal");

document.getElementById("openModal").onclick = () => {
  modal.classList.remove("hidden");
};

function closeModal() {
  modal.classList.add("hidden");
}

function toggleNote(note) {
  note.classList.toggle("open");
}