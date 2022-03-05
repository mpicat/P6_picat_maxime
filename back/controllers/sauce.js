// Deportation de la logique métier (les fonctions présentes dans les routes)

// importation du model Sauce
const Sauce = require('../models/Sauce');

// importation du package fs de node (file system) qui donne accès aux opérations du système de fichiers
// utilisation ici pour la suppresion d'images
const fs = require('fs');


// exportation d'une fonction qui récupère toutes les sauces
exports.getAllSauces = (req, res, next) => {
    // find permet de retrouver des objets dans la base de données
    Sauce.find()
    // récupération du tableau des sauces
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};

// exportation d'une fonction qui récupère une sauce
exports.getOneSauce = (req, res, next) => {
    // findOne permet de retrouver un objet dans la base de données (vérification de l'id)
    Sauce.findOne({_id: req.params.id})
    // récupération de la sauce spécifique
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};

// exportation d'une fonction qui créé une sauce
exports.createSauce = (req, res, next) => {
    // le format de la req est modifié via multer, il s'agit d'un string que l'on va modifier en object
    const sauceObject = JSON.parse(req.body.sauce);
    // création d'une nouvelle instance du modèle Sauce
    const sauce = new Sauce ({
        // copie des champs du body de la req
        ...sauceObject,
        // récupération de l'URL de la localisation de notre image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [' '],
        usersDisliked: [' ']
    });
    // sauvegarde la nouvelle instance dans la base + promesse
    sauce.save()
    // envoi d'une res sinon la req plante 
    .then(() => res.status(201).json({ message: 'Sauce ajoutée !'}))
    .catch(error => res.status(400).json({error}));
};

// exportation d'une fonction qui modifie une sauce
exports.modifySauce = (req, res, next) => {
    // nouvelle image importée ou pas de modification d'image
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    // met à jour une sauce de la base de données : vérification de l'id + modification
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({error}));
};

// exportation d'une fonction qui supprime une sauce et son image
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id:req.params.id})
    .then((sauce) => {
        // sauce non présente dans la base
        if(!sauce) {
            return res.status(404).json({error : new Error('Sauce non trouvée !')});
        }
        // id de l'utilisateur différente de l'id du créateur de la sauce
        if (sauce.userId !== req.auth.userId) {
            return res.status(403).json({error : new Error('Requête non authorisée !')});
        }
        // récupération du nom du fichier à supprimer (ici, l'image)
        const filename = sauce.imageUrl.split('/images/')[1];
        // unlink supprime un fichier
        fs.unlink(`images/${filename}`, () => {
            // une fois le fichier supprimé, on supprime la sauce de la base de données avec vérification de l'id
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({error}));
        });
    })
    .catch(error => res.status(500).json({error}));
};

// exportation d'une fonction pour like ou dislike des sauce
exports.likeSauce = async (req, res, next) => {
    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id

    // TODO implement try/catch statement here
    const sauce = await Sauce.findOne({_id: req.params.id});

    switch (like) {
        case 1 :
            Sauce.updateOne({_id: sauceId}, {$push: {usersLiked: userId}, $inc: {likes: +1}})
            // TODO forbid second same user like
            .then(() => res.status(200).json({message: "Vous avez liké"}))
            .catch((error) => res.status(400).json({error}))
            break;
        
        case 0 :
            if (sauce.usersLiked.includes(userId)) { 
                Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                    .then(() => res.status(200).json({ message: `Vous ne likez plus` }))
                    .catch((error) => res.status(400).json({ error }))
            }
            // TODO why cannot access usersDisliked ?
            console.log(sauce, sauce.usersDisliked); process.exit();
            if (sauce.usersDisliked.includes(userId)) { 
                Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                    .then(() => res.status(200).json({ message: `Vous ne dislikez plus` }))
                    .catch((error) => res.status(400).json({ error }))
            }
            break;
        
        case -1 :
            Sauce.updateOne({_id: sauceId}, {$push: {usersDisliked: userId}, $inc: {dislikes: +1}})
            // TODO update users like/dislike arrays accodingly
            .then(() => res.status(200).json({message: "Vous avez disliké"}))
            .catch((error) => res.status(400).json({error}))
            break;

        default: console.log(error);
    }

    
};