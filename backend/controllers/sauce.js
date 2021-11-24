const fs = require("fs"); // Import du module file-system
const Sauce = require("../models/sauce"); // Import du modèle Sauce avec mongoose

// Controleur pour créer une nouvelle sauce
exports.createSauce = (req, res, next) => {
    // Création d'une nouvelle sauce en enregistrant les nouvelles données dans la variable sauceObject
    const sauceObject = JSON.parse(req.body.sauce);
    // Suppression de l'ID de sauceObject (MongoDB va lui-même attribuer un ID à la sauce)
    delete sauceObject._id;
    // Création de l'instance sauce de l'objet Sauce
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    // Enregistrement de toutes les données de la sauce dans la collection Sauce de MongoDB
    sauce.save()
        .then(() => res.status(201).json({message: "Nouvelle sauce piquante enregistrée !"}))
        .catch(error => res.status(400).json({error}));
};


//Controleur pour gérer les like/dislike sur une sauce
exports.addFeeling = (req, res, next) => {
    let likeState = req.body.like; // Récupère la valeur du like/dislike
    let userId = req.body.userId; // Récupère l'ID de l'utilisateur
    let sauceId = req.params.id; // Récupère l'ID de la sauce

    Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
            const newFeelings = {
                likes: 0,
                dislikes: 0,
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked
            }
            switch (likeState) {
                // 1. Si l'utilisateur like la sauce
                case 1:
                    newFeelings.usersLiked.push(userId);
                    break;

                // 2. Si l'utilisateur dislike la sauce
                case -1:
                    newFeelings.usersDisliked.push(userId);
                    break;

                // 3. Si l'utilisateur retire son like/dislike :
                case 0:
                    // Si l'utilisateur retire son like de la sauce
                    if (newFeelings.usersLiked.includes(userId)) {
                        const indexUser = newFeelings.usersLiked.indexOf(userId);
                        newFeelings.usersLiked.splice(indexUser, 1);
                    }
                    // Si l'utilisateur retire son dislike de la sauce
                    if (newFeelings.usersDisliked.includes(userId)) {
                        const indexUser = newFeelings.usersDisliked.indexOf(userId);
                        newFeelings.usersDisliked.splice(indexUser, 1);
                    }
                    break;
            }
            newFeelings.likes =  newFeelings.usersLiked.length;
            newFeelings.dislikes =  newFeelings.usersDisliked.length;
            // Mise à jour des données de la sauce dans la BDD
            Sauce.updateOne({_id: sauceId },  newFeelings )
                .then(() => res.status(200).json({message: "La sauce est notée !"}))
                .catch((error) => res.status(400).json({error}))
        })
        .catch((error) => res.status(400).json({ error }))
}

// Controleur pour modifier une sauce
exports.modifySauce = (req, res, next) => {
    /*
    La question à se poser est de savoir si dans la modification, y-a-t-il une nouvelle image pour la sauce à modifier ?
     En fonction de la réponse, on va passer des données différentes dans la variable sauceObject
     */
    let sauceObject = {};
    if (req.file) { // Y-a-t-il la présence d'un nouveau fichier image dans la requête de modif ?
        // 1er cas : Oui il y a une nouvelle image à modifier :
        Sauce.findOne({_id: req.params.id})
            .then((sauce) => {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`};
                    // Mise à jour des données de la sauce à modifier (avec son ID)
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({message: "Sauce piquante modifiée !"}))
                        .catch(error => res.status(400).json({error}));
                })
            })
        // On récupère toutes les modifs + l'URL de la nouvelle image
        // 2ème cas : Non il n'y a pas de nouvelle image dans la modification : récupérer tout le reste des données de la sauce
    } else {
        sauceObject = { ...req.body };
        // Mise à jour des données de la sauce à modifier (avec son ID)
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({message: "Sauce piquante modifiée !"}))
            .catch(error => res.status(400).json({error}));
    }
}

// Controleur pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    // D'abord, on supprime l'image de la sauce à supprimer du répertoire en isolant son URL :
    // Récupération d'une sauce (avec son ID) de la collection sauces dans MongoDB
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            // Isolement de l'URL de l'image associée à la sauce à supprimer
            const filename = sauce.imageUrl.split("/images/")[1];
            // Puis on supprime tout :
            // Suppression de l'image de la sauce à supprimer
            fs.unlink(`images/${filename}`, () => {
                // Suppression des données de la sauce (avec son ID) dans la collection sauces de MongoDB
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: "Sauce piquante supprimée !"}))
                    .catch(error => res.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({error}));
};

// Controleur pour afficher une sauce
exports.getOneSauce = (req, res, next) => {
    // Récupération d'une sauce (avec son ID) de la collection sauces dans MongoDB
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
};

// Controleur pour afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
    // Récupération de toutes les sauces de la collection sauces dans MongoDB (sous forme d'un Array)
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}))
};
