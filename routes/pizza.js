var express = require('express');
var router = express.Router();

// var ws = null;
var allActive = require('../websocket');
var Pizza = require('../schemas/pizza-schemas');
function update() {
    // console.log(allActive);
    // console.log("colled",ws);
    for(user in allActive)
        allActive[user].send("new update");
    // if (ws === null) {
    //     result.then(res => {
    //         ws = res;
    //         ws.send("new update");
    //     })
    // }
    // if (ws)
    //     ws.send("new update");
}
/* GET pizza listing. */
router.get('/', function (req, res, next) {
    Pizza.find({}, function (err, pizza) {
        if (err) throw Error;
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
