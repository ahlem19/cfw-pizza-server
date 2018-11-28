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
        required: false
    },

}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Pizza', pizzaSchema);