async function fetchNotes() {
    const response = await fetch('/get_notes');
    const notes = await response.json();
    const container = document.getElementById('notesContainer');
    container.innerHTML = '';
    notes.forEach(note => {
        container.innerHTML += `
        <div class="note" id="note-${note._id}">
            <p id="text-${note._id}">${note.text}</p>
            <div class="note-buttons">
                <button class="edit-btn"
                onclick="showEditBox('${note._id}', \`${note.text}\`)">
                Edit
                </button>
                <button class="delete-btn"
                onclick="deleteNote('${note._id}')">
                Delete
                </button>
            </div>
        </div>
        `;
    });
}

async function addNote() {
    const text = document.getElementById('noteText').value;
    if (text.trim() === '') {
        alert('Please write something');
        return;
    }
    await fetch('/add_note', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text
        })
    });
    document.getElementById('noteText').value = '';
    fetchNotes();
}

async function deleteNote(id) {
    await fetch(`/delete_note/${id}`, {
        method: 'DELETE'
    });
    fetchNotes();
}

function showEditBox(id, oldText) {
    const noteDiv = document.getElementById(`note-${id}`);
    noteDiv.innerHTML = `
        <textarea id="edit-text-${id}" class="edit-area">${oldText}</textarea>
        <div class="note-buttons">
            <button class="edit-btn"
            onclick="saveEdit('${id}')">
            Save
            </button>
            <button class="delete-btn"
            onclick="fetchNotes()">
            Cancel
            </button>
        </div>
    `;
}

async function saveEdit(id) {
    const newText = document.getElementById(`edit-text-${id}`).value;
    if (newText.trim() === '') {
        alert('Note cannot be empty');
        return;
    }
    await fetch(`/edit_note/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: newText
        })
    });
    fetchNotes();
}

fetchNotes();