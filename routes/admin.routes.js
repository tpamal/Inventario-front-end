'use strict'

var user = require('../controllers/user.controller');
var express = require('express');
var api = express.Router();
var middlewareAuth = require('../middlewares/authenticated');


// Rutas Administrador
api.post('/saveAdmin', user.saveAdmin);

api.post('/login', user.login);
api.put('/updateAdmin', middlewareAuth.ensureAuth, user.updateAdmin);
api.delete('/deleteAdmin', middlewareAuth.ensureAuth, user.deleteAdmin);

// Rutas Productos
api.post('/saveProduct', middlewareAuth.ensureAuth, user.saveProduct);
api.put('/updateProduct/:id', middlewareAuth.ensureAuth, user.updateProduct);
api.delete('/deleteProduct/:id',middlewareAuth.ensureAuth, user.deleteProduct);
api.get('/listProduct',middlewareAuth.ensureAuth, user.listProduct);
api.get('/controlStock', middlewareAuth.ensureAuth, user.controlStock);
api.get('/buscarProduct', middlewareAuth.ensureAuth, user.buscarProduct);
api.get('/productsAgotados' , middlewareAuth.ensureAuth, user.productsAgotados);
api.post('/restarStoke', middlewareAuth.ensureAuth, user.restarStoke);
api.post('/sumarStoke', middlewareAuth.ensureAuth, user.sumarStoke);
api.get('/findAll', user.findAll);



// Rutas Empleados
api.post('/saveEmployees', middlewareAuth.ensureAuth, user.saveEmployees);
api.put('/updateEmployees/:id', middlewareAuth.ensureAuth, user.updateEmployees);
api.delete('/deleteEmployees/:id',middlewareAuth.ensureAuth, user.deleteEmployees);
api.get('/listEmployees',middlewareAuth.ensureAuth, user.listEmployees);
api.get('/findAllEmployees', user.findAllEmployees);



// Patrimio de la empresa
api.post('/savePatrimony', middlewareAuth.ensureAuth, user.savePatrimony);
api.put('/updatePatrimony/:id', middlewareAuth.ensureAuth, user.updatePatrimony);
api.delete('/deletePatrimony/:id',middlewareAuth.ensureAuth, user.deletePatrimony);
api.get('/listPatrimony',middlewareAuth.ensureAuth, user.listPatrimony);
api.get('/findAllPatrimony', user.findAllPatrimony);







module.exports = api;
