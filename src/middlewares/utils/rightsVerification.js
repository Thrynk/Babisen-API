const rights = require('./rights');
const translations = require("./rightsTranslations");

module.exports = function(req, res, next, level){
    if(req.rights.level >= rights[level]){
        next();
    }
    else{
        res.status(401).send(
            {
                message: "You need " + level + " rights to do this action",
                message_fr: "Vous devez avoir les droits d'un " + translations.fr[level] + " pour effectuer cette action"
            });
    }
};
