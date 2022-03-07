const mongoose = require('mongoose');

// création de schema : modèle de données utilisable par mongoDB
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
    usersDisliked: {type: [String], default: []}
});

module.exports = mongoose.model('Sauce', sauceSchema);