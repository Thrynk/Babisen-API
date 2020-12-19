module.exports = function(req, res){
    res.clearCookie("headerPayload");
    res.clearCookie("signature");
    res.clearCookie("refreshToken");
    res.status(200)
        .send({
            message: "User logged out",
            message_fr: "Utilisateur déconnecté"
        });
};
