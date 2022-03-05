// création du serveur node : permet d'executer du code JS côté serveur
// serveur attend des requêtes http et y répond

// importation package http de node (require : commande pour importer package)
const http = require('http');
// importation de app
const app = require('./app');

// l'application express tourne ici sur l'environnement ou le port 3000
app.set('port', process.env.PORT || 3000);


// création du serveur + passage de l'application au serveur
const server = http.createServer(app);


// listen : permet d'écouter les requêtes envoyées, ici sur le port 3000
// process.env.PORT : cas où l'environnement sur lequel tourne le serveur demande un port particulier
server.listen(process.env.PORT || 3000);