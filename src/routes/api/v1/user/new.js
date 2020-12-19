const User = require("../../../../models/User");
const bcrypt = require("bcrypt");

module.exports = async function(req, res){

    // encrypts password
    if(req.body.password){
        req.body.password = await bcrypt.hash(req.body.password, 10)
            .catch(function(error){
                res.status(500).send(error);
            });
    }

    let newUser = new User(req.body);

    // try saving the user (save it if validation is ok)
    newUser.save().then(function(savedUser) {
        savedUser.password = undefined;
        res.status(201)
            .send(
                {
                    message: "User registered",
                    message_fr: "Utilisateur inscrit",
                    user: savedUser
                }
            )
        ;

    // User validation failed send errors
    }).catch(function(error){
        res.status(422)
            .send(
                {
                    message: error._message,
                    message_fr: "Erreur lors de la validation de l'utilisateur",
                    errors: error.errors
                }
            )
        ;
    });
};
