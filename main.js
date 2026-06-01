
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function showNotes(list) {
  let grid = document.getElementById("notesList");
  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = "<p class='col-span-3 text-center text-gray-400 text-sm py-5'>No notes yet!</p>";
    return;
  }

  for (let i = 0; i < list.length; i++) {

    let card = document.createElement("div");
    card.className = "note-card bg-white rounded-md p-3 flex flex-col gap-2 border-1 hover:border-gray-700 hover:border-3";

    let noteTitle = document.createElement("div");
    noteTitle.textContent = "Note " + list[i].id;
    noteTitle.className = "text-sm font-bold text-black";

    let noteText = document.createElement("div");
    noteText.textContent = list[i].text;
    noteText.className = "note-text text-sm text-gray-600 break-words flex-1";

    let actions = document.createElement("div");
    actions.className = "note-actions flex gap-2 mt-1";

    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "btn-edit bg-blue-600 hover:bg-blue-800 text-white text-xs px-3 py-1 rounded cursor-pointer";
    editBtn.setAttribute("data-index", i);

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "btn-delete bg-red-700 hover:bg-red-900 text-white text-xs px-3 py-1 rounded cursor-pointer";
    deleteBtn.setAttribute("data-index", i);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(noteTitle);
    card.appendChild(noteText);
    card.appendChild(actions);

    grid.appendChild(card);
  }
}

document.getElementById("addBtn").addEventListener("click", function() {
  let input = document.getElementById("noteInput");
  let text = input.value.trim();

  if (text === "") return;

  notes.push({ id: notes.length + 1, text: text });
  saveNotes();
  showNotes(notes);
  input.value = "";
});

document.getElementById("cancelBtn").addEventListener("click", function() {
  document.getElementById("noteInput").value = "";
});

document.getElementById("notesList").addEventListener("click", function(e) {
  let index = e.target.getAttribute("data-index");
  if (index === null) return;

  if (e.target.classList.contains("btn-delete")) {
    notes.splice(index, 1);
    for (let i = 0; i < notes.length; i++) {
      notes[i].id = i + 1;
    }
    saveNotes();
    showNotes(notes);
  }

  if (e.target.classList.contains("btn-edit")) {
    let card = e.target.closest(".note-card");
    let textDiv = card.querySelector(".note-text");
    let actionsDiv = card.querySelector(".note-actions");
    let currentText = notes[index].text;

    let textarea = document.createElement("textarea");
    textarea.className = "edit-area w-full h-16 border border-gray-300 rounded p-2 text-sm";
    textarea.setAttribute("data-index", index);
    textarea.value = currentText;

    textDiv.replaceWith(textarea);

    actionsDiv.innerHTML = "";

    let saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.className = "btn-save bg-green-700 hover:bg-green-900 text-white text-xs px-3 py-1 rounded cursor-pointer";
    saveBtn.setAttribute("data-index", index);

    let cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "btn-cancel bg-white hover:bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded border border-gray-300 cursor-pointer";
    cancelBtn.setAttribute("data-index", index);

    actionsDiv.appendChild(saveBtn);
    actionsDiv.appendChild(cancelBtn);
  }

  if (e.target.classList.contains("btn-save")) {
    let card = e.target.closest(".note-card");
    let textarea = card.querySelector(".edit-area");
    let newText = textarea.value.trim();

    if (newText === "") return;

    notes[index].text = newText;
    saveNotes();
    showNotes(notes);
  }

  if (e.target.classList.contains("btn-cancel")) {
    showNotes(notes);
  }
});

document.getElementById("searchInput").addEventListener("input", function() {
  let query = this.value.toLowerCase();
  let filtered = notes.filter(function(note) {
    return note.text.toLowerCase().includes(query);
  });
  showNotes(filtered);
});

showNotes(notes);