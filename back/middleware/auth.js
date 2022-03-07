const jwt = require('jsonwebtoken');
require('dotenv').config();

// récupération du token dans le header authorization
const getTokenFromReqHeaders = (req) => {
    // on split au niveau de l'espace et on recupère le 2ème élément (le token)
    const token = req.headers.authorization.split(' ')[1];
    return token;
}

const getUserIdFromReqBody = (req) => {
    // si pas de userId dans le request body, on l'assigne à un string vide
    const reqUserId = req.body && req.body.userId ? req.body.userId : '';
    return reqUserId;
}

const verifyUserToken = (token, reqUserId) => {
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decodedToken.userId;
    // si il y a un userId avec la req, il doit correspondre à celui du token
    if (reqUserId && reqUserId !== userId) {
        throw 'User ID non valable !';
    }
    return userId;
}

const authMiddleware = (req, res, next) => {
    // utilisation de try car plusieurs élements peuvent poser problèmes
    try {
        const userId = verifyUserToken(getTokenFromReqHeaders(req), getUserIdFromReqBody(req));
        // attribuer l'userid à l'userid dans l'objet req (pour la voie delete)
        req.auth = {userId};
        next();
    } catch (error) {
        res.status(403).json({error: 'Action non autorisée'});
    }
};

module.exports = {
    getTokenFromReqHeaders,
    getUserIdFromReqBody,
    verifyUserToken,
    authMiddleware
};