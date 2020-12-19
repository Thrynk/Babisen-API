const User = require("../../../../models/User");
const jwt = require("jsonwebtoken");

module.exports = function(req, res){
    if(req.cookies.refreshToken){
        const refreshToken = req.cookies.refreshToken;

        //console.log("got refresh token : " + refreshToken);

        // Verify token
        jwt.verify(refreshToken, process.env.TOKEN_SECRET, async function(err, decoded) {

            // if is valid passes to next function
            if(!err){

                // populate req with user id
                let token = jwt.sign(
                    {
                        id: decoded.id,
                        type: decoded.type
                    },
                    process.env.TOKEN_SECRET,
                    {
                        expiresIn: 60 * 15
                    }
                );

                let user = await User.findById(decoded.id);

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

                //console.log("new token " + token);

                // place token in 2 cookies (secure way of storing tokens, better way than localStorage)
                res.cookie('headerPayload', headerPayload, cookieHeaderPayloadConfig);
                res.cookie('signature', signature, cookieSignatureConfig);

                user.password = undefined;
                res.status(200).send({message: "User info", message_fr: "Informations utilisateur", user: user, token_expiry: 60 * 15});

            }
            // else send Unauthorized status with error message
            else{
                res.status(401).send({
                    message: "Token is not valid"
                });
            }
        })
    }
    else{
        // Get token from header or cookies
        let token;
        let authHeaderContent = req.get('authorization');
        if(authHeaderContent && authHeaderContent.startsWith('Bearer ')){
            token = authHeaderContent.slice(7);
        }
        else if(req.cookies.headerPayload && req.cookies.signature){
            token = req.cookies.headerPayload + "." + req.cookies.signature;
        }

        if(token){
            // Verify token
            jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
                // if is valid passes to next function
                if(!err){
                    // populate req with user id
                    req.user = {
                        id: decoded.id,
                        type: decoded.type
                    };

                    User.findOne({_id: req.user.id}, async function (err, user) {
                        if (!err) {
                            if (user) {

                                // remove password from object to not send it to the user
                                user.password = undefined;
                                res.status(200).send({
                                    message: "User info",
                                    message_fr: "Informations utilisateur",
                                    user: user
                                });
                            } else {
                                res.status(404).send({
                                    message: "User not found",
                                    message_fr: "Utilisateur introuvable"
                                });
                            }
                        } else {
                            res.sendStatus(500);
                        }
                    });
                }
                // else send Unauthorized status with error message
                else{
                    res.status(401).send({
                        message: "Token is not valid"
                    });
                }
            })
        }
        else{
            res.status(401).send({
                message: "No token provided"
            });
        }
    }
};
