// Déportation des routes de sauces

// importation d'express pour créer un routeur
const express = require('express');
// création d'un router
const router = express.Router();
// importation du controller sauce (logique métier)
const sauceCtrl = require('../controllers/sauce');
// importation du middleware d'anthentification
const auth = require('../middleware/auth');
// importation du middleware multer (facilite gestion de fichiers envoyés)
const multer = require('../middleware/multer-config');


// route protégée pour récupérer l'ensemble des sauces
router.get('/', auth, sauceCtrl.getAllSauces);

// route protégée pour récupérer une sauce spécifique
router.get('/:id', auth, sauceCtrl.getOneSauce);

// route protégée ajout de sauce
// utilise multer
router.post('/', auth, multer, sauceCtrl.createSauce);

// route protégée modification de sauce
// utilise multer
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// route protégée suppression de sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// route protégée liker/disliker
router.post('/:id/like', auth, sauceCtrl.likeSauce)



// exportation du router
module.exports = router;