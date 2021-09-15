var mongoose = require('mongoose');
var Schema = mongoose.Schema
var Room = mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
}, {
    timestamps: true
})
module.exports = mongoose.model('Rooms', Room);
