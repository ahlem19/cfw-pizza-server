var express = require('express');
var router = express.Router();
var allActive = require('../websocket');
var Pizza = require('../schemas/pizza-schemas');
function update() {
    for (user in allActive)
        allActive[user].send("new update");
}
/* GET pizza listing. */
router.get('/', function (req, res, next) {

    if (req.query.next)
        var next = Number(req.query.next);
    else
        var next = 0;
    var query = [
        { $sort: { _id: 1 } },
        { $skip: next},
        { $limit: 5 }
    ];
    Pizza.aggregate(query, function (err, pizza) {
        if (err) throw err;
        res.json(pizza);
    });
});

/* POST users listing. */
router.post('/', function (req, res, next) {
    let pizza = req.body.pizza;
    Pizza.create(pizza, (err, doc) => {
        if (err) throw err;
        res.json({ message: 'pizza added succussfully ', core: doc });
        update();
    });

});

router.put('/:id', function (req, res, next) {
    let pizzaId = req.params.id;
    let pizza = req.body.pizza;
    Pizza.findByIdAndUpdate(pizzaId, {
        $set:
        {
            label: pizza.label,
            ingredient: pizza.ingredient,
            price: pizza.price,
            picture: pizza.picture

        }
    }
        , { new: true }, function (err, pizza) {
            if (err) throw err;
            update();
            res.json({ message: 'pizza updated succussfully ', core: pizza });

        });
});

router.delete('/:id', function (req, res, next) {
    let pizzaId = req.params.id;
    Pizza.remove({ _id: pizzaId }, (err, doc) => {
        if (err) throw err;
        update();
        res.json({ message: 'pizza deleted succussfully ', core: doc });

    });

});


module.exports = router;
