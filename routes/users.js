var express = require('express');
var router = express.Router();

var Users = require('../schemas/user-schema');

/* GET users listing. */
router.get('/', function (req, res, next) {
   Users.find({}, function (err, users) {
      if (err) throw Error;
      res.json(users);
   });
});

/* POST users listing. */
router.post('/', function (req, res, next) {
   let user = req.body.user;
   Users.create(user, (err, doc) => {
      if (err) throw err;
      res.json({ message: 'user inserted succussfully ', core: doc });
   });

});

router.put('/:id', function (req, res, next) {
   let userId = req.params.id;
   let user = req.body.user;
   Users.findByIdAndUpdate(userId, {
      $set:
      {
         username: user.username,
         email: user.email,
         avatar_url: user.avatar_url,
         pwd: user.pwd

      }
   }
   , { new: true }, function (err, user) {
      if (err) throw err;
      res.json({ message: 'user updated succussfully ', core: user });

   });
});

router.delete('/:id', function (req, res, next) {
   let userId = req.params.id;
   Users.remove({_id:userId}, (err, doc) => {
      if (err) throw err;
      res.json({ message: 'user deleted succussfully ', core: doc });

   });

});


   module.exports = router;
