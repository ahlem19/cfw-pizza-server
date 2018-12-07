var jsonwebtoken = require('jsonwebtoken');
var CONFING = require('../config/jwt-config.json');
var TOKEN_SECRET = CONFING.token.secret;

// route middleware to verify a token

function verifyToken(req, res, next) {
    // check header or url or post parameter for token

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verify secret and cheks exp
        jsonwebtoken.verify(token, TOKEN_SECRET, function(err, decoded) {
            if (err) {
                res.status(403).json({
                    success: false,
                    message: 'Failed to authenticate'
                });
                return;
            }

            // if evrything is good, save to request for use in other routes
            req.decoded = decoded;
            next();
        });
    } else {
        // if there is no token return error
        res.status(403).json({
            success: false,
            message: 'Failed to authenticate'
        });
    }
}

function getTokenPayload(req) {
    var payload = null;

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.header['x-access-token'];
    if (token) {
        payload = jsonwebtoken.decode(token, { complete: true }).payload;
        console.log(payload);
    }
    return payload;

}


function getEmailFromToken(req) {
    var payload = getTokenPayload(req);
    if (payload) {
        return payload.email;
    }
}

module.exports = {
    verifyToken: verifyToken,
    getEmailFromToken: getEmailFromToken
};