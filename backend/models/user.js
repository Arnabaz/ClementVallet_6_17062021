/* --- Définition d'un schéma de données pour l'utilisateur --- */
const mongoose = require("mongoose"); // Import du module mongoose

const userSchema = new mongoose.Schema ({
    email: { type: String, required: true },
    password: { type: String, required: true }
});


// Création d'un modèle et export
module.exports = mongoose.model("User", userSchema);