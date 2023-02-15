const mongoose = require('mongoose');

let articleSchema = new mongoose.Schema({
    title: String,
    titlePlain: String,
    text: String,
    textPlain: String,
    short: String,
    shortPlain: String,
    img: String,
    writtenBy: String,
    writtenByPlain: String,
    photo: String,
    alias: {type: String, default: 'article'}
});

module.exports = mongoose.model('Article', articleSchema);