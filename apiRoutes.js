// Require fs module to write and append notes
const fs = require('fs');

// API routing:
module.exports = (app) => {
    // GET `/notes` - Should return the `notes.html` file.
    app.get("/notes", function (req, res) {
        res.sendFile(path.join(__dirname, "./main-files/notes.html"));
    });

    // GET `/` - Should return the `index.html` file
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "./main-files/index.html"));
    });
}