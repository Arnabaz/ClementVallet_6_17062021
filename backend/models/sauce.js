/* --- Définition d'un schéma de données pour une sauce --- */
const mongoose = require("mongoose"); // Import du module mongoose

const sauceSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true},
    manufacturer: { type: String, required: true},
    description: { type: String, required: true },
    mainPepper: { type: String, required: true},
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] }
});

module.exports = mongoose.model('Sauce', sauceSchema);