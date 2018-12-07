var mongoose = require('mongoose');
var schema = mongoose.Schema;
var _ = require('lodash');
var bcrypt = require('bcrypt');

const userSchema = new schema({
    username: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    adress: {
        type: String,
        index: true
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    avatar_url: {
        type: String
    },

    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User"
    }
}, {
    timestamps: true
});



module.exports = mongoose.model('User', userSchema);