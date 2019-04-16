// Dependencies
const express = require("express");
const mongojs = require("mongojs");

// Initialize Express
const app = express();

// PORT for the server
const PORT = process.env.PORT || 3000;

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Database configuration
// Save the URL of our database as well as the name of our collection
const databaseUrl = "newsDB";
const collections = ["news"];

// Use mongojs to hook the database to the db variable
const db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", error => {
  console.log("Database Error:", error);
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello world");
});

// Set the app to listen on port 3000
app.listen(PORT, () => {
  console.log(`App running on port http://localhost:${PORT}`);
});