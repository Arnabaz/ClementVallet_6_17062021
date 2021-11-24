// Import des modules et packages
const express = require("express"); // Import de Express.js
const mongoose = require("mongoose"); // Import de mongoose
const dotenv = require("dotenv").config(); // Import de Dotenv

// Déclaration des variables
const usernameDB = process.env.MONGO_DB_USER;
const passwordDB = process.env.MONGO_DB_PASS;
const nameDB = process.env.MONGO_DB_NAME;

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

// Connexion avec MongoDB Atlas (via mongoose)
mongoose.connect(`mongodb+srv://${usernameDB}:${passwordDB}@cluster0.ola9w.mongodb.net/${nameDB}?retryWrites=true&w=majority`, { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => console.log('Connexion à MongoDB échouée !'))

// Création de l'application Express.js
const app = express();

// CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Content-Security-Policy", "default-src 'self'");
    next();
});

// MIDDLEWARE
// Utilisation d'un middleware pour "body-parser" la requête
app.use(express.json());

// Utilisation du middleware d'authentification sur la route Utilisateur
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

// Export de l'application
module.exports = app;