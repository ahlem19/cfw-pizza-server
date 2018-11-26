var mongoose = require('mongoose');
var schema = mongoose.Schema;

const pizzaSchema = new schema({
    label: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    price: {
        type: Number
    },
    picture: {
        type: String,
        required: false,
        default: 'http://la-cucina.fr/wp-content/uploads/2014/07/gal1.jpg'
    },

}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Pizza', pizzaSchema);