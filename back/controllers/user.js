// Deportation de la logique métier (les fonctions présentes dans les routes)


// package de cryptage pour les mdps
const bcrypt = require('bcrypt');
// package pour créer des tokens et de les vérifier
const jwt = require('jsonwebtoken');
// importation du model User
const User = require('../models/User');
require('dotenv').config();

// enregistrement d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    // hachage du mdp, salt 10 : hachage effectué 10 fois
    bcrypt.hash(req.body.password, 10)
    // récupération du hash + enregistrement dans la base de données
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({message : "Utilisateur créé !"}))
        .catch(error => res.status(400).json({error}));
    })
    // erreur serveur
    .catch(error => res.status(500).json({error}))
};


// connection d'utilisateurs existants
exports.login = (req, res, next) => {
    // trouver le user
    User.findOne({email: req.body.email})
    // vérification de la présence d'un user
    .then(user => {
        // pas de user correspondant
        if(!user) {
            return res.status(401).json({error: 'Utilisateur non trouvé !'});
        }
        // user correspondant, comparaison via bcrypt du mdp utilisé par le user avec le hash précédemment enregistré
        // retourne un booléen
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            // comparaison false
            if (!valid) {
                return res.status(401).json({message: 'Mot de passe incorrect !'});
            }
            // comparaison true : renvoie son userId + un token d'authentification
            res.status(200).json({
                userId: user._id,
                token: jwt.sign (
                    // données que l'on veut encoder : payload
                    {userId: user._id},
                    // clé pour l'encodage
                    process.env.SECRET_TOKEN,
                    // expiration du token
                    {expiresIn: '24h'}
                    )
            });
        })
        .catch(error => res.status(500).json({error}));
    })
    // si problème de connection, car dans le cas où le user n'existe pas la promise sera résolue, elle ne contiendra cependant pas de user
    .catch(error => res.status(500).json({error}))
};