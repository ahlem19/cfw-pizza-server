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
        default: 'http://localhost:3000/ressources/pizza-pictures/file-5bfd307bfa969c5bf59ec9d9.jpg'
    },

}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Pizza', pizzaSchema);