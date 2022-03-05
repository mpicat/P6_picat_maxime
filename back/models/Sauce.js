const mongoose = require('mongoose');

// création de schema de données via la méthode Schema (modèle de données utilisable par mongoDB) de mongoose
// mongoDB génère automatiquement des identifiants
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String},
    description: {type: String},
    mainPepper: {type: String},
    imageUrl: {type: String},
    heat: {type: Number},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    usersLiked: {type: [String], default: []},
    usersDisLiked: {type: [String], default: []}
});

// export du schema via la méthode model
module.exports = mongoose.model('Sauce', sauceSchema);