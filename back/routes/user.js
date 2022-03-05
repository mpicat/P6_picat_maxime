// Déportation des routes de user

// importation d'express pour créer un routeur
const express = require('express');
// création du router
const router = express.Router();
// importation du controller user (logique métier)
const userCtrl = require('../controllers/user');
// importation du contrôle de mdp
const checkPassword = require("../middleware/check-password")

// route pour enregistrer un nouvel utilisateur
router.post('/signup', checkPassword, userCtrl.signup);

// route pour s'identifier
router.post('/login', userCtrl.login);


module.exports = router;