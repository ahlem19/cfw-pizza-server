var express = require('express');
var bcrypt = require('bcrypt');
var jsonwebtoken = require('jsonwebtoken');
var CONFIG = require('../config/jwt-config.json');
var TOKEN_SECRET = CONFIG.token.secret;
var TOKEN_EXPIRES = parseInt(CONFIG.token.expiresInSeconds, 10);
var _ = require('lodash');
var tokenMiddleWare = require('../middleware/token');

var User = require('../schemas/user-schema');

var router = express.Router();

router.post('/', function createUser(req, res) {
    console.log(req.body);
    // find the user
    User.findOne({
        email: req.body.email
    }, function handleQuery(error, user) {
        if (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
            return;
        }
        if (user) {
            res.status(409).json({ success: false, message: 'User with the email \'' + req.body.email + '\' already exists.' });
            return;
        }
        bcrypt.genSalt(10, function(error, salt) {
            if (error) {
                res.status(500).json({ success: false, message: 'Internal server error' });
                throw error;
            }
            bcrypt.hash(req.body.password, salt, function(error, hash) {
                if (error) {
                    res.status(500).json({ success: false, message: 'Internal server error' });
                    throw error;
                }
                var user = new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: hash
                });
                user.save(function(error) {
                    if (error) {
                        res.status(500).json({ success: false, message: 'Internal server error' });
                        throw error;
                    }
                    res.json({ success: true, user: user });
                });
            });
        });
    });
});

router.post('/authenticate', function authenticateUser(req, res) {
    // find the user
    User.findOne({
        email: req.body.email
    }, function handleQuery(error, user) {
        if (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
            throw error;
        }
        if (!user) {
            res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
            return;
        }
        bcrypt.compare(req.body.password, user.password, function(error, result) {
            if (error) {
                res.status(500).json({ success: false, message: 'Internal server error' });
                throw error;
            }
            if (!result) {
                res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
                return;
            }

            // if user is found and password is right
            // create a token
            var token = jsonwebtoken.sign({ email: user.email }, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRES });

            // return the information including token as JSON
            res.json({ success: true, token: token, user: userInfo(user) });

        });
    });
});


// return all users for admin
router.get('/', tokenMiddleWare.verifyToken, function(req, res, next) {
    User.find({}, function(err, users) {
        if (err || !users) res.status(403).json({ message: err });
        users = users.map(u => userInfo(u));
        res.json(users);
    });
});

router.get('/:id', tokenMiddleWare.verifyToken, function(req, res, next) {
    User.findById({ _id: req.params.id }, function(err, user) {
        if (err || !user) res.status(403).json({ message: err });
        res.json(userInfo(user));
    });
});

router.put('/:id', tokenMiddleWare.verifyToken, function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        console.log(user);
        if (err || !user) {
            return res.sendStatus(401);
        }

        // only update fields that were actually passed...
        if (typeof req.body.user.username !== 'undefined') {
            user.set({ username: req.body.user.username });
        }
        if (typeof req.body.user.email !== 'undefined') {
            user.set({ email: req.body.user.email });
        }
        if (typeof req.body.user.adress !== 'undefined') {
            user.set({ adress: req.body.user.adress });
        }
        if (typeof req.body.user.city !== 'undefined') {
            user.set({ city: req.body.user.city });
        }
        if (typeof req.body.user.coutry !== 'undefined') {
            user.set({ country: req.body.user.country });
        }
        if (typeof req.body.user.role !== 'undefined') {
            user.set({ role: req.body.user.role });
        }

        user.save(function(err, updatedUser) {
            if (err) return res.json({ message: "User update failed..." });
            res.send({ success: true, user: userInfo(updatedUser) });
        });
    });
});

router.delete('/:id', tokenMiddleWare.verifyToken, function(req, res, next) {
    User.deleteOne({ _id: req.params.id }, function(err) {
        if (err) return res.status(401).json({ sucess: false, message: "Can\'t remove user" });
        res.status(200).json({ success: true, message: "User rmouved from our database :( " });
    });
});


function userInfo(user) {
    var publicUserInfo = {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        adress: user.adress,
        city: user.city,
        country: user.country,
        role: user.role
    };
    return publicUserInfo;
}


module.exports = router;