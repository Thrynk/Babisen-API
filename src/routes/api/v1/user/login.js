const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../../../models/User");
var moment = require('moment-timezone');
moment().tz("France").format();

module.exports = function(req, res){
    // Check if form data was sent
    if(req.body.username !== undefined && req.body.password !== undefined){


        // Get user info from database
        User.findOne({username: req.body.username }, async function (err, user) {
            if(err){
                res.status(500).send(err);
            }
            else if(user !== null){
                user.subscription = req.body.subscription;

                await user.save({validateBeforeSave: false});

                // Compare user password to password typed
                bcrypt.compare(req.body.password, user.password, async function(err, result){
                    if(result){
                        // Creation of authentication token
                        let token = jwt.sign(
                            {
                                id: user._id,
                                type: user.type
                            },
                            process.env.TOKEN_SECRET,
                            {
                                expiresIn: 60 * 15
                            }
                        );

                        let tokenParts = token.split('.');

                        let headerPayload = tokenParts[0] + "." + tokenParts[1];

                        let signature = tokenParts[2];

                        let cookieSignatureConfig = {
                            httpOnly: true,
                            secure: false
                        };

                        let cookieHeaderPayloadConfig = {
                            secure: false,
                            maxAge: 1000 * 60 * 15
                        };

                        let token_expiry = undefined;

                        if(req.body.stayConnected){
                            let refreshToken = jwt.sign(
                                {
                                    id: user._id,
                                    type: user.type
                                },
                                process.env.TOKEN_SECRET,
                                {
                                    expiresIn: 60 * 60 * 24 * 365 // refresh token valid during one year
                                }
                            );

                            console.log("refresh token : " + refreshToken);

                            let cookieRefreshTokenConfig = {
                                httpOnly: true,
                                secure: false,
                                maxAge: 1000 * 60 * 24 * 365
                            };

                            token_expiry = 60 * 15;

                            // place refresh token in httpOnly cookie
                            res.cookie('refreshToken', refreshToken, cookieRefreshTokenConfig);
                        }

                        // place token in 2 cookies (secure way of storing tokens, better way than localStorage)
                        res.cookie('headerPayload', headerPayload, cookieHeaderPayloadConfig);
                        res.cookie('signature', signature, cookieSignatureConfig);

                        // remove password from user object
                        user.password = undefined;
                        res.status(200).send({message: "User info", message_fr: "Informations utilisateur", user: user, token_expiry: token_expiry});
                    }
                    // Incorrect credentials
                    else{
                        res.status(401).send({message: "Incorrect credentials", message_fr: "Informations incorrectes"});
                    }
                });
            }
            else{
                res.status(404).send({message: "User not found with this username", message_fr: "Utilisateur introuvable avec cet username"});
            }

        })
    }
    // missing credential(s)
    else{
        res.status(422).send({message: "missing username or password", message_fr: "Username ou mot de passe manquant"});
    }
};
