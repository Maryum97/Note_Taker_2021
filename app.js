// Dependancies
const express = require('express');
const path = require('path');
const fs = requier('fs');

// Define the port
const PORT = process.env.PORT || 3000;

// Set up the Express app
const app = express();

// Stringify the code
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Start the server to listen to the request
app.listen(PORT, () => console.log(`Listening on: http://localhost:${PORT}`));
