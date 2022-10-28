'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var patrimonySchema = Schema({
    article_name: String,
    serial: String,
    cost: Number,
    descripcion: String
    
});

module.exports = mongoose.model('patrimony', patrimonySchema);