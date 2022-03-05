// Utilisation de multer : facilite la gestion de fichiers envoyés par des req http vers notre API

const multer = require('multer');

// dictionnaire des différents mime_types
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// création d'un objet de configuration pour multer
// diskStorage : méthode pour stocker sur le disque
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // null : pas d'erreur
        callback(null, 'images')
    },
    // explique à multer le nom du fichier à utiliser
    // on ne peut pas utiliser le fichier d'origine (sinon problème en cas de 2 fichiers possédant le même nom)
    filename: (req, file, callback) => {
        // récupérer nom d'origine en remplaçant les espace par des _ pour ne rencontrer aucun problème avec les navigateurs
        const name = file.originalname.split(' ').join('_');
        // extension du fichier
        const extension = MIME_TYPES[file.mimetype];
        // construction du nom avec ajout d'un timestamp pour augmenter les chances de le rendre unique
        callback(null, name + Date.now() + '.' + extension);
    }
});

// exportation du middleware
// single : fichier unique, ici une image
module.exports = multer({storage}).single('image');