// fichier app : contient l'application

// importer express (framework de node pour créer une application)
const express = require('express');
// importer mongoose (package qui facilite interactions entre express et mongoDB)
const mongoose = require('mongoose');
// importation de helmet
const helmet = require('helmet');
// importation du router des sauces
const sauceRoutes = require('./routes/sauce');
// importation du router des users
const userRoutes = require('./routes/user');
// donne accès au chemin de système de fichiers
const path = require('path')
// ajout de la configuration de dotenv pour cacher des infos sensibles du code
require('dotenv').config()

// connection de l'API sur la base de données mongoDB
mongoose.connect(process.env.MY_DB,
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// app : l'application
const app = express();

// renvoie des réponses en JSON
// intercepte les req qui contiennent du JSON et met à disposition le body de celles-ci par la suite via req.body
app.use(express.json());

// utilisation de helmet pour une meilleure sécurité
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

// app.use : utilisation de la fonction qui suit pour chaque type de requête, pas de spécification
// middleware : fonction dans une app express qui reçoit req et res, les gèrent et les passent à un autre middleware via next
app.use((req, res, next) => {
    // ici nous autorisons tout le monde à utiliser notre API - ajout de header sur les réponses
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
    // next renvoie la res
    next();
});


// utilisation du dossier images en cas de req vers /images
// dirname : nom du dossier dans lequel on se trouve
app.use('/images', express.static(path.join(__dirname, 'images')));

// utilisation du router pour la route /api/sauce
app.use('/api/sauces', sauceRoutes);

// utilisation du router pour la route /api/auth
app.use('/api/auth', userRoutes);


// export de l'application pour pouvoir y accéder depuis d'autres fichiers
module.exports = app;