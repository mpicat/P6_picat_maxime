// package de cryptage pour les mdps
const bcrypt = require('bcrypt');
// package pour créer des tokens et de les vérifier
const jwt = require('jsonwebtoken');

const User = require('../models/User');
require('dotenv').config();

const serverErrorMess =  "Erreur, veuillez réessayer plus tard...";

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
        .catch(error => res.status(400).json({message : "L'utilisateur n'a pas été créé"}));
    })
    // erreur serveur
    .catch(error => res.status(500).json({serverErrorMess}))
};


// connection d'utilisateurs existants
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user) {
            return res.status(404).json({error: 'Utilisateur non trouvé !'});
        }
        // user correspondant, comparaison via bcrypt du mdp utilisé par le user avec le hash précédemment enregistré
        // retourne un booléen
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                res.status(401).json({message: 'Mot de passe incorrect !'});
            } else {
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
            }
        })
        .catch(error => res.status(500).json({serverErrorMess}));
    })
    // si problème de connection, car dans le cas où le user n'existe pas la promise sera résolue, elle ne contiendra cependant pas de user
    .catch(error => res.status(500).json({serverErrorMess}))
};