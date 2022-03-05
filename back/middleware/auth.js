//Middleware d'authentification

const jwt = require('jsonwebtoken');
require('dotenv').config();

// fonction d'authentification
module.exports = (req, res, next) => {
    // utilisation de try car plusieurs élements peuvent poser problèmes
    // gestion de chaque cas
    try {
        // récupération du token dans le header authorization
        // on split au niveau de l'espace et on recupère le 2ème élément (le token)
        const token = req.headers.authorization.split(' ')[1];
        // décoder le token en objet JS
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        const userId = decodedToken.userId;
        // attribuer l'userid à l'userid dans l'objet req
        req.auth = {userId};
        // si il y a un userId avec la req, il doit correspondre à celui du token
        if (req.body.userId && req.body.userId !== userId) {
            // renvoie une erreur
            throw 'User ID non valable';
        } else {
            // si c'est bon on renvoie au middleware suivant
            next();
        }
    } catch (error) {
        // ici on pourra personnaliser les messages d'erreur si on veut
        res.status(403).json({error: error | 'Unauthorized request'});
    }
};