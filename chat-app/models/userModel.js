var mongoose = require('mongoose');
var Schema = mongoose.Schema
var User = mongoose.Schema({
    email: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    
    mobileNo: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    status: {                       // 1=Verified Account ,2=Blocked By Admin 
        type: Number,
        trim: true,
        default: 1
    },
    timezone: {
        type: String,
        trim: true
    },
    jwtToken: {
        type: String,
        trim: true
    },
    
}, {
    timestamps: true
})
module.exports = mongoose.model('users', User);
