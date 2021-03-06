//======================================================================
// Dependancies
const express = require('express');
const fs = require('fs');
const path = require('path');
const notesData = require('./db/db.json');
var uniqid = require('uniqid');

//======================================================================
// Define the port
const PORT = process.env.PORT || 3000;

//======================================================================
// Set up the Express app
const app = express();

//======================================================================
// Render the css stylesheet properly
app.use(express.static("main-files"));

//======================================================================
// Set up the code for data parsing, as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//======================================================================
// Page loading, to start with index.html and then notes.html
// GET `/` - Should return the `index.html` file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./main-files/html/index.html"));
});
// GET `/notes` - Should return the `notes.html` file.
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./main-files/html/notes.html"));
});

//======================================================================
// GET, POST, DELETE API Endpoints
//========== FUNCTIONS ==========
writeToDB = (notes) => {
    // Converts new JSON Array back to string
    notes = JSON.stringify(notes);
    console.log(notes);
    // Writes String back to db.json
    fs.writeFile("./db/db.json", notes, (err) => {
        if (err) {
            return console.log(err);
        }
        else {
            console.log('Action successful!')
        }
    });
}

//========== API ROUTES ==========
// GET Method to return all notes
app.get("/api/notes", (req, res) => {
    res.json(notesData);
});

// POST Method to add notes
app.post("/api/notes", (req, res) => {
    // Set unique id to entry
    var myNewNote = req.body;
    // if (notesData.length == 0) {
    //     myNewNote.id = "0";
    // } else {
    //     myNewNote.id = JSON.stringify(notesData[notesData.length - 1].id) + 1;
    // }
    myNewNote.id = uniqid();
    console.log("req.body.id: " + myNewNote);
    // Pushes Body to JSON Array
    notesData.push(myNewNote);
    // Write notes data to database
    writeToDB(notesData);
    // returns new note in JSON format.
    res.json(notesData);
});

// DELETE Method to delete note with specified ID
app.delete("/api/notes/:id", (req, res) => {
    // Obtains id and converts to a string
    const noteId = req.params.id;
    console.log(noteId);
    // Goes through notesArray searching for matching ID
    for (i = 0; i < notesData.length; i++) {
        if (notesData[i].id == noteId) {
            console.log("match!");
            // Removes the deleted note
            notesData.splice(i, 1);
            console.log(notesData);
            break;
        }
    }
    
    // Write notes data to database
    writeToDB(notesData);
    // Insted of this, use fs.writeFile, and then stringify the id
    res.json(notesData);
});

//=================================================================
// Start the server to listen to the request
app.listen(PORT, () => console.log(`Listening on: http://localhost:${PORT}`));