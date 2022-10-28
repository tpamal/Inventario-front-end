'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSchema = Schema({

    nameProduct: String,
    stoke: Number,
    precio: Number,
    description: String,
    Product_sale: Number,
    profits: Number,

});


module.exports = mongoose.model('producto', productoSchema);