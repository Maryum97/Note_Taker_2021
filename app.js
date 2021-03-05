//======================================================================
// Dependancies
const express = require('express');
const fs = require('fs');
const path = require('path');
const database = require('./db/db.json');

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

// GET and POST functions grabbing from the same route here
app.route("/api/notes").get((req, res) => { // Get notes list
    res.json(database);
}).post((req, res) => { // Add new notes to the db file
    let jsonFilePath = path.join(__dirname, "/db/db.json");
    let newNote = req.body;

    // Set original id to new note added to db
    let greatestId = 99;
    for (let i = 0; i < database.length; i++) {
        let indivNote = database[i];

        if (indivNote.id > greatestId) {
            greatestId = indivNote.id;
        }
    }

    // Assign new id to new notes added to db
    newNote = greatestId + 1;
    database.push(newNote);

    // Rewrite db.json file
    fs.writeFile(jsonFilePath, JSON.stringify(database), (err) => {
        if (err) {
            return console.log(err);
        }
        console.log("Your note has been saved!");
    });
    res.json(newNote);
});

//=================================================================
// Delete a note based on an ID
app.delete("/api/notes/:id", (req, res) => {
    let jsonFilePath = path.join(__dirname, "/db/db.json");

    // Request to delete note by id
    for (let i = 0; i < database.length; i++) {
        if (database[i].id === req.params.id) {
            database.splice(i, 1);
            break;
        }
    }

    // Write db.json file again
    fs.writeFileSync(jsonFilePath, JSON.stringify(database), (err) => {

        if (err) {
            return console.log(err);
        } else {
            console.log("Your note has been deleted!");
        }
    });
    res.json(database);
})

//=================================================================
// Start the server to listen to the request
app.listen(PORT, () => console.log(`Listening on: http://localhost:${PORT}`));
