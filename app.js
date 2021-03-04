// Dependancies
const express = require('express');
const fs = require('fs');
const path = require('path');

// Define the port
const PORT = process.env.PORT || 3000;

// Set up the Express app
const app = express();

// Render the css stylesheet properly
app.use(express.static("main-files"));

// Stringify the code
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Get the routes:

// API routing:
// GET `/notes` - Should return the `notes.html` file.
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./main-files/html/notes.html"));
});

// GET `/` - Should return the `index.html` file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./main-files/html/index.html"));
});

// GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
let noteList = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

app.get("/api/notes", (req, res) => {
    return res.json(noteList);
});

// POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post('/api/notes', (req, res) => {
    // get Id of last note if it exists
    let lastId;
    if (noteList.length) {
        lastId = Math.max(...(noteList.map(note => note.id)));
        //Otherwise set to 0
    }
    else {
        lastId = 0;
    }

    //Starts the id's at 1
    const id = lastId + 1;

    // pushes the id of the note along with the rest of the text/input of the array in the request.body
    noteList.push({ id, ...req.body });
    //Removes last index
    res.json(noteList.slice(-1));
});

// DELETE `/api/notes/:id` -
app.delete('/api/notes/:id', (req, res) => {
    //finds note by id, then converts the string into a JSON object with the id parameters of the request made
    let findNote = noteList.find(({ id }) => id === JSON.parse(req.params.id));

    //Delete object matching the index of the note ID
    noteList.splice(noteList.indexOf(findNote), 1);
    res.end("Note was deleted");
});

// Start the server to listen to the request
app.listen(PORT, () => console.log(`Listening on: http://localhost:${PORT}`));
