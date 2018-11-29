var express = require('express');
var multer = require('multer');
var Q = require('q');
var router = express.Router();
var Pizza = require('../schemas/pizza-schemas');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, './ressources/pizza-pictures');
    },
    filename: function(req, file, cb) {
        var pizzaId = req.body.pizzaId;
        var path = file.fieldname + '-' + Date.now() + '-' + pizzaId + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        cb(null, path);

        updatePicture(pizzaId, path)
            .then(function() {
                res.sendStatus(200);
            })
            .catch(function(err) {
                res.status(400).send(err);
            });
    }
});

var upload = multer({ //multer settings
    storage: storage
}).any('picture');

function updatePicture(id, path) {
    var deferred = Q.defer();
    Pizza.findByIdAndUpdate({ _id: id }, { $set: { picture: path } },
        function(err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            deferred.resolve();
        });
    return deferred.promise;
}

router.post('/picture', upload, function(req, res, next) {
    upload(req, res, function(err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        res.json({ error_code: 0, err_desc: 'Picture successfully uploaded' });
    });
});

module.exports = router;