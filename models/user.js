const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');

let userSchema = new mongoose.Schema({
    username: String,
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);