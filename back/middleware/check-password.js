const passwordSchema = require('../models/Password');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({ message: 'Le MDP doit contenir minimum 10 caractères, dont au moins une majuscule, une minuscule et un chiffre.' });
    } else {
        next();
    }
};