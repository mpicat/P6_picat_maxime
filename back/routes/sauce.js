const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const {authMiddleware} = require('../middleware/auth');
const multer = require('../middleware/multer-config');


// route pour récupérer l'ensemble des sauces
router.get('/', authMiddleware, sauceCtrl.getAllSauces);

// route pour récupérer une sauce spécifique
router.get('/:id', authMiddleware, sauceCtrl.getOneSauce);

// route ajout de sauce
router.post('/', authMiddleware, multer, sauceCtrl.createSauce);

// route modification de sauce
router.put('/:id', authMiddleware, multer, sauceCtrl.modifySauce);

// route suppression de sauce
router.delete('/:id', authMiddleware, sauceCtrl.deleteSauce);

// route liker/disliker
router.post('/:id/like', authMiddleware, sauceCtrl.likeSauce)


module.exports = router;