// importation d'express pour créer un routeur
const express = require('express');
// création du router
const router = express.Router();

const userCtrl = require('../controllers/user');
const checkPassword = require("../middleware/check-password")

// route pour enregistrer un nouvel utilisateur
router.post('/signup', checkPassword, userCtrl.signup);

// route pour s'identifier
router.post('/login', userCtrl.login);


module.exports = router;