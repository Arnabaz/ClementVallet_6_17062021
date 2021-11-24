const bcrypt = require("bcrypt"); // Import du module bcrypt (hachage du mot de passe utilisateur)
const jwt = require("jsonwebtoken"); // Import du module jsonwebtoken (gestion des tokens d'authentification)

const User = require("../models/user"); // Import du modèle Utilisateur avec mongoose

// Controleur pour s'inscrire dans l'application (1ère utilisation)
exports.signup = (req, res, next) => {
    // Hachage du mot de passe avec bcrypt
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Création d'une instance du modèle User contenant l'email et le mot de passe haché
            const user = new User({
                email: req.body.email,
                password: hash
            })
            // Enregistrement de l'utilisateur dans MongoDB
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé !"}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


// Controleur pour s'identifier dans l'application
exports.login = (req, res, next) => {
    // Recherche de l'utilisateur dans la DB avec son email
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si l'utilisateur n'existe pas, renvoyer une erreur
            if (!user) {
                return res.status(401).json({ error: " Utilisateur non trouvé !" })
            }
            // Si l'utilisateur existe, comparer les mots de passe avec bcrypt (compare renvoie true ou false)
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si les mots de passe sont différents, renvoyer une erreur
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect !"});
                    }
                    // Si les mots de passe sont identiques, envoyer la réponse
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            "RANDOM_TOKEN_SECRET",
                            { expiresIn: "24h" }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};