const http = require("http"); // Import du module http - Voir si on peut utiliser https (requiert un certificat SSL - Se renseigner)
const app = require("./app"); // Import de app (liaison de l'application avec le serveur)


// Configuration du port de connexion en fonction de l'environnnement
// Définition de la fonction normalizePort pour renvoyer un port valide
const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

// Ajout d'un port de connexion si non déclaré par l'environnement (méthode manuelle)
// Si pas de port fourni dans le fichier.env, on écoutera le port 3000
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port); // Liaison du port de connexion avec l'application

// Recherche des différentes erreurs avec errorHandler
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// Création d'un serveur avec Express qui utilise l'appli
const server = http.createServer(app);

// Mise en route du serveur et affichage du port de connexion (ou gestion des erreurs si nécessaire)
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === "string" ? "pipe " + address : "port " + port;
    console.log("Listening on " + bind);
});

// Ecoute du port par le serveur
server.listen(port);