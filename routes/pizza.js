var express = require('express');
var router = express.Router();
var allActive = require('../websocket');
var Pizza = require('../schemas/pizza-schemas');
var tokenMiddleWare = require('../middleware/token');

function update() {
    for (var user in allActive)
        allActive[user].send("new update");
}
/* GET pizza listing. */
router.get('/', tokenMiddleWare.verifyToken, function(req, res) {
    Pizza.find({}, function(err, pizza) {
        if (err) {
            res.status(501).json({ error: err, mesage: "Server Error" })
        }
        res.json(pizza);
    });
});

/* POST Pizza. */
router.post('/', tokenMiddleWare.verifyToken, function(req, res, next) {
    var pizza = req.body.pizza;
    Pizza.create(pizza, function(err, doc) {
        if (err) throw err;
        res.json({ message: 'pizza added succussfully ', core: doc });
        update();
    });

});

router.put('/:id', tokenMiddleWare.verifyToken, function(req, res, next) {
    var pizzaId = req.params.id;
    var pizza = req.body.pizza;
    Pizza.findByIdAndUpdate(pizzaId, {
        $set: {
            label: pizza.label,
            ingredients: pizza.ingredients,
            price: pizza.price,
            picture: pizza.picture

        }
    }, { new: true }, function(err, pizza) {
        if (err) throw err;
        update();
        res.json({ message: 'pizza updated succussfully ', core: pizza });

    });
});

router.delete('/:id', tokenMiddleWare.verifyToken, function(req, res, next) {
    var pizzaId = req.params.id;
    Pizza.remove({ _id: pizzaId }, function(err, doc) {
        if (err) throw err;
        update();
        res.json({ message: 'pizza deleted succussfully ', core: doc });

    });

});


module.exports = router;