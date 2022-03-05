const mongoose = require('mongoose');

// unique validator améliore les messages d'erreur lors de l'enregistrement de données uniques
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
    // unique true : impossibilité de s'inscrire plusieurs fois avec la même adresse mail, possibilité erreurs de mongoDB
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

// application du validateur au schema via la méthode plugin
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);