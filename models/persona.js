const mongoose = require('mongoose');

let personaSchema = new mongoose.Schema({
    name: String,
    about: String,
    aboutPlain: String,
    short: String,
    shortPlain: String,
    additional: String,
    additionalPlain: String,
    namelink: String,
    img: String,
    order: Number
});

module.exports = mongoose.model('Persona', personaSchema);