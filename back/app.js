// express : framework de node pour créer une application
// mongoose : package qui facilite interactions entre express et mongoDB
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
require('dotenv').config();

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// donne accès au chemin de système de fichiers
const path = require('path')

mongoose.connect(process.env.MY_DB,
    { useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// intercepte les req qui contiennent du JSON et met à disposition le body de celles-ci par la suite via req.body
app.use(express.json());

app.use(helmet({
    crossOriginResourcePolicy: false,
}));

// middleware : fonction dans une app express qui reçoit req et res, les gèrent et les passent à un autre middleware via next
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
    next();
});


// utilisation du dossier images en cas de req vers /images
// dirname : nom du dossier dans lequel on se trouve
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);

app.use('/api/auth', userRoutes);


// export de l'application pour pouvoir y accéder depuis d'autres fichiers
module.exports = app;