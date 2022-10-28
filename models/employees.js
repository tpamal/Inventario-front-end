'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeesSchema = Schema({
    name: String,
    dpi: String,
    sueldo: String,
    departamento: String,
    horaEntrada: String,
    horaSalida: String,
    phone: Number,
    
});

module.exports = mongoose.model('employees', employeesSchema);