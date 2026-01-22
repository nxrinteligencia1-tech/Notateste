// script.js
const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const addBtn = document.getElementById("addNote");
const notesList = document.getElementById("notesList");
const newNote = document.getElementById("newNote");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.body.classList.add("dark");
}

openBtn.onclick = () => modal.classList.remove("hidden");
closeBtn.onclick = () => modal.classList.add("hidden");

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes() {
  notesList.innerHTML = "";

  notes.forEach((text, index) => {
    const note = document.createElement("div");
    note.className = "note";

    const preview = text.split("\n")[0].slice(0, 80);

    note.innerHTML = `
      <div class="note-header">Nota</div>
      <div class="note-preview">${preview}...</div>
      <div class="note-content">${text}</div>
      <div class="note-actions">
        <button class="edit">Editar</button>
        <button class="copy">Copiar</button>
        <button class="delete">Apagar</button>
      </div>
    `;

    note.onclick = e => {
      if (e.target.tagName === "BUTTON") return;
      note.classList.toggle("open");
    };

    note.querySelector(".copy").onclick = () => {
      navigator.clipboard.writeText(text);
    };

    note.querySelector(".delete").onclick = () => {
      notes.splice(index, 1);
      saveNotes();
      renderNotes();
    };

    note.querySelector(".edit").onclick = () => {
      const edited = prompt("Editar nota:", text);
      if (edited !== null) {
        notes[index] = edited;
        saveNotes();
        renderNotes();
      }
    };

    notesList.appendChild(note);
  });
}

addBtn.onclick = () => {
  if (!newNote.value.trim()) return;
  notes.unshift(newNote.value);
  newNote.value = "";
  saveNotes();
  renderNotes();
};

renderNotes();