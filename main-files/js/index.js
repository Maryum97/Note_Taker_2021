// Call elements from the './notes' page
let noteTitle = $('.note-title');
let noteText = $('.note-textarea');
let saveNoteBtn = $('.save-note');
let newNoteBtn = $('.new-note');
let noteList = $('.list-container .list-group');

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// Get all the notes from the db
var getNotes = () => {
    return $.ajax({
        url: '/api/notes',
        method: 'GET'
    });
};

// Save a note to the db
var saveNote = (note) => {
    return $.ajax({
        url: "/api/notes",
        data: note,
        method: "POST"
    });
};

// Save the note to the db
var deleteNote = (id) => {
    return $.ajax({
        url: "api/notes/" + id,
        method: "DELETE"
    });
};

// If there is an activeNote, display it, otherwise render empty inputs
var renderActiveNote = () => {
    saveNoteBtn.hide();

    if (activeNote.id) {
        noteTitle.attr('readonly', true);
        noteText.attr('readonly', true);
        noteTitle.val(activeNote.title);
        noteText.val(activeNote.text);
    } else {
        noteTitle.attr("readonly", false);
        noteText.attr("readonly", false);
        noteTitle.val("");
        noteText.val("");
    }
};

// Get the note data from the inputs, save it to the db and update the view
var handleNoteSave = () => {
    const newNote = {
        title: noteTitle.val(),
        text: noteText.val(),
    };
    saveNote(newNote).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// Delete the clicked note
var handleNoteDelete = (e) => {
    // prevents the click listener for the list from being called when the button inside of it is clicked
    e.stopPropagation();

    var noteId = $(this)
        .parent(".list-group-item")
        .data();

    if (activeNote.id === noteId) {
        activeNote = {};
    }

    deleteNote(noteId).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// Sets the activeNote and displays it
var handleNoteView = (e) => {
    e.preventDefault();
    activeNote = $(this).data();
    renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
var handleNewNoteView = (e) => {
    activeNote = {};
    renderActiveNote();
};

// If a note's title or text are empty, hide the save button
// Or else show it
var handleRenderSaveBtn = function () {
    if (!noteTitle.val().trim() || !noteText.val().trim()) {
        saveNoteBtn.hide();
    } else {
        saveNoteBtn.show();
    }
};

// Render's the list of note titles
var renderNoteList = function (notes) {
    noteList.empty();

    var noteListItems = [];

    for (var i = 0; i < notes.length; i++) {
        var note = notes[i];

        var li = $("<li class='list-group-item'>").data(note);
        var span = $("<span>").text(note.title);
        var delBtn = $(
            "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
        );

        li.append(span, delBtn);
        noteListItems.push(li);
    }

    noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
var getAndRenderNotes = function () {
    return getNotes().then(function (data) {
        renderNoteList(data);
    });
};

saveNoteBtn.on("click", handleNoteSave);
noteList.on("click", ".list-group-item", handleNoteView);
newNoteBtn.on("click", handleNewNoteView);
noteList.on("click", ".delete-note", handleNoteDelete);
noteTitle.on("keyup", handleRenderSaveBtn);
noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();