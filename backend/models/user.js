/* --- Définition d'un schéma de données pour l'utilisateur --- */
const mongoose = require("mongoose"); // Import du module mongoose
const uniqueValidator = require("mongoose-unique-validator");// Import du module mongoose-unique-validator

const userSchema = new mongoose.Schema ({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

// Création d'un modèle et export
module.exports = mongoose.model("User", userSchema);