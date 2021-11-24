// Import des modules et packages
const express = require("express"); // Import de Express.js
const mongoose = require("mongoose"); // Import de mongoose
const dotenv = require("dotenv").config(); // Import de Dotenv

// Déclaration des variables
const usernameDB = process.env.MONGO_DB_USER;
const passwordDB = process.env.MONGO_DB_PASS;
const nameDB = process.env.MONGO_DB_NAME;

// Connexion avec MongoDB Atlas (via mongoose)
mongoose.connect(`mongodb+srv://${usernameDB}:${passwordDB}@cluster0.ola9w.mongodb.net/${nameDB}?retryWrites=true&w=majority`, { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => console.log('Connexion à MongoDB échouée !'))

// Création de l'application Express.js
const app = express();

// Export de l'application
module.exports = app;