const jwt = require("jsonwebtoken");
const Sauce = require("../models/sauce"); // Import du modèle Sauce avec mongoose

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
        const userId = decodedToken.userId;
        Sauce.findOne({_id: req.params.id})
            .then((sauce) => {
                return sauceUserId = sauce.userId;
            });
        if (sauceUserId !== userId) {
            throw "Vous n'êtes pas autorisé à modifier cette sauce.";
        } else {
            next();
        }
    } catch (error) {
        res.status(403).json({ error : "Unauthorized Request !" });
    }
};

