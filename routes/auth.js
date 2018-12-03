var express = require('express');
var router = express.Router();
var bcrypt = require("bcrypt");
var Users = require('../schemas/user-schema');

/* POST users listing. */
router.post('/', function (req, res) {
   // let user = req.body.user;
   Users.findOne({
      email: req.body.email
   }, (err, doc) => {
      if (err) throw err;
      if (doc.length === 0) {
         res.json({ message: 'failed incorrect auth', error: 1 });
         return;
      }
      else {
         var isCorrectPassword = bcrypt.compareSync(req.body.password, doc.pwd);
         if (isCorrectPassword) {
            var token = genSaltSync();
            Users.updateOne({ "_id": doc._id }, {
               $set: {
                  token: token
               }
            });
            res.json({ message: 'success login', error: 0, token: token });
         }
         else {
            res.json({ message: 'failed incorrect auth', error: 1 });
            return;
         }
         return;
      }
   });

});
module.exports = router;
