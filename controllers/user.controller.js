'use strict'

var User = require ('../models/user');
var Cusos = require('../models/cursos')
var Employees = require ('../models/employees');
var Products = require ('../models/products');
var Patrimony = require ('../models/patrimony');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');


//--------------Crear Admin de empresa------------------------

function saveAdmin(req, res) {
    var user = new User();
    var params = req.body;

    if( params.name &&
        params.email &&
        params.password){
            User.findOne({$or:[{email: params.email}]}, (err, userFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general, intentelo mas tarde'})
                }else if(userFind){
                    res.send({message: 'usuario o correo ya utilizado'});
                }else{
                    user.name = params.name;
                    user.email = params.email;

                    bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                        if(err){
                            res.status(500).send({message: 'Error al encriptar contraseña'});
                        }else if(passwordHash){
                            user.password = passwordHash;

                            user.save((err, userSaved)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general al guardar usuario'});
                                }else if(userSaved){
                                    res.send({user: userSaved});
                                }else{
                                    res.status(404).send({message: 'Usuario no guardado'});
                                }
                            });
                        }else{
                            res.status(418).send({message: 'Error inesperado'});
                        }
                    });
                }
            });
    }else{
        res.send({message: 'Ingresa todos los datos'});
    }
}



// Loguear Admin 
function login(req, res) {
    var params = req.body;

    if (params.email) {
        if(params.password){
            User.findOne({$or:[{email: params.email}]}, (err, userFind)=>{
                if(err){
                    res.status(500).send({message:'Error in the server'});
                }else if(userFind){
                    bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                        if(err){
                            res.status(500).send({message: 'Error al comparar contraseñas'});
                        }else if (checkPassword){
                            if(params.gettoken){
                                res.send({token:jwt.createToken(userFind)})
                            }else{
                                res.send({user: userFind});
                            }
                        }else{
                            res.status(418).send({message: 'Contraseña incorrecta'});
                        }
                    });
                }else{
                    res.send({message: 'Usuario no encontrado'});
                }
            });
        }else{
            res.send({message: 'Por favor ingresa la contraseña'});
        }
    }else{
        res.send({message: 'Ingresa el email'});
    }
}



// editar Admin
function updateAdmin(req, res) {
    var update = req.body;
    User.findByIdAndUpdate(req.user.sub , update, { new: true }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (userUpdated) {
            res.status(200).send({ user_actualizado: userUpdated });
        } else {
            res.status(200).send({ message: 'Error al actualizar' });
        }
    });
}


// Eliminar Admin
function deleteAdmin(req, res) {
    User.findByIdAndRemove(req.user.sub , (err, userDeleted) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (userDeleted) {
            res.status(200).send({ message: 'Usuario eliminado', userDeleted });
        } else {
            res.status(404).send({ message: 'Error al eliminar' });
        }
    });

}


// Crear Producto
function saveProduct(req, res) {
    var products = new Products();
    var params = req.body;

    if( params.nameProduct ){
        Products.findOne({nameProduct:params.nameProduct}, (err, productFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                }else if(productFind){
                    res.send({message:' nombre de producto ya utilizado'});
                }else{
                    products.nameProduct = params.nameProduct;
                    products.stoke = params.stoke;
                    products.precio = params.precio;
                    products.description = params.description;
                    products.Product_sale = 0;
                    products.profits = 0;
                    products.capital_Total=0;
                   
                    products.save((err, productsSaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error general al guardar'});
                        }else if(productsSaved){
                            res.send({products: productsSaved});
                        }else{
                            res.status(418).send({message: 'Error al guardar'});
                        }
                    });

                }
            });
    }else{
        res.send({message: 'Ingrese todos los campos'});
    }

}



// Editar Product
function updateProduct(req, res) {
    var productsId = req.params.id;
    var update = req.body;

    Products.findByIdAndUpdate(productsId, update, { new: true }, (err, productsUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (productsUpdated) {
            res.status(200).send({ product_actualizado: productsUpdated });
        } else {
            res.status(200).send({ message: 'Error al actualizar' });
        }
    });
}


// Eliminar Product
function deleteProduct(req, res) {
    var productsId = req.params.id;

    Products.findByIdAndRemove(productsId, (err, productsDeleted) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (productsDeleted) {
            res.status(200).send({ message: 'Productos eliminados', productsDeleted });
        } else {
            res.status(404).send({ message: 'Error al eliminar' });
        }
    });

}


// listar Productos
function listProduct(req, res) {
    Products.find({}).exec((err, products) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (products) {
            res.status(200).send({ todos_los_product: products });
        } else {
            res.status(200).send({ message: 'No se obtuvieron datos' });
        }
    });
}


// 
function findAll(req, res){
    Products.find({}, {password:0, cuh:0}, (err, response)=>{
        if (err) {
            res.status(500).send({ message: "Error del servidor" });
        } else if (response) {
            res.send({ products: response});
        } else {
            res.status(404).send({ message: "Sin products que mostrar" });
        }
    })
}


// Control Stoke
function controlStock(req, res) {
    Products.find({}).exec((err, products) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (products) {
            res.status(200).send({ Productos_en_Bodega: products.length });
        } else {
            res.status(200).send({ message: 'No hay producto existente' });
        }
    });
}



// Buscar Producto
function buscarProduct(req, res){
    var productName = req.body.productName
    Products.find({nameProduct:productName},(err, productsBuscado)=>{
        if(err) return res.status(500).send({message: 'error de la peticion'})
        if(!productsBuscado) return res.status(404).send({message: 'no se pudo buscar'})
        return res.status(200).send({Products: productsBuscado})
    })
}


// Producto Agotado
function productsAgotados(req, res) {
    Products.find({ stoke: 0 }).populate('products').exec((err, soldOut) => {
        if(err) {
            return res.status(500).send({ message: 'Error General'})
        } else {
            return res.status(200).send({ agotados: soldOut})
        }
    })
}   


// Restar Producto Vendido
function restarStoke(req, res) {
    var name_Product = req.body.name_Product
    var shopping = req.body.shopping
    Products.findOne({nameProduct:name_Product},(err, productsBuscado)=>{
        if(err) return res.status(500).send({message: 'error de la peticion'});
        if(!productsBuscado) return res.status(404).send({message: 'no se pudo buscar'});
        if( shopping <= productsBuscado.stoke){
            var updated_stock = productsBuscado.stoke - shopping;
            var total_Cash = productsBuscado.precio * shopping;
            var num = productsBuscado.stoke - updated_stock;    
            var total_sale= productsBuscado.Product_sale + num;
            var total_profits = productsBuscado.profits + total_Cash;
            var iva = total_profits * 0.12;
            var resta_iva = total_profits - iva;
            Products.updateOne({nameProduct:name_Product},{$set:{stoke:updated_stock,Product_sale:total_sale,profits:total_profits}},(err ,cantidadActu)=>{
                if(err) return res.status(500).send({message: 'error de la peticion'});
                if(!cantidadActu) return res.status(404).send({message: 'no se pudo actualizar el producto aun tiene el stock de antes'})           
                return res.status(200).send({message:"Stoke Actualizado de Bodega", updated_stock, mesage:" total a pagar",total_Cash,
            sales:" Producto vendido",  total_sale, profitss:" Ingresos Total", total_profits, Total:" Ganacias, pagando iva ", resta_iva});
            });

        }else{
            res.status(200).send({message: 'No hay suficiente stock para realizar la compra'});
        }
    })
}



// Producto que entro a bodega
function sumarStoke(req, res) {
    var nuevo_Producto = req.body.nuevo_Producto
    var compraProduct = req.body.compraProduct
    Products.findOne({nameProduct:nuevo_Producto},(err, productsBuscado)=>{
        if(err) return res.status(500).send({message: 'error de la peticion'});
        if(!productsBuscado) return res.status(404).send({message: 'no se pudo buscar'});
            var updated_stock = productsBuscado.stoke - compraProduct;
            var varible = compraProduct * 2;
            var stokeActualizado = updated_stock + varible;
            Products.updateOne({nameProduct:nuevo_Producto},{$set:{stoke:stokeActualizado}},(err ,cantidadActu)=>{
                if(err) return res.status(500).send({message: 'error de la peticion'});
                if(!cantidadActu) return res.status(404).send({message: 'no se pudo actualizar el producto aun tiene el stock de antes'})           
                return res.status(200).send({message:"Stoke Actualizado", stokeActualizado});
            });
    })

}


// Crear empleado
function saveEmployees(req, res) {
    var params = req.body;
    var employees = Employees();

    if (params.name &&
        params.dpi &&
        params.sueldo &&
        params.departamento &&
        params.horaEntrada &&
        params.horaSalida &&
        params.phone) {
        Employees.findOne({
            dpi: params.dpi
        }, (err, employeesFind) => {
            if (err) {
                res.status(500).send({message: 'Error en el servidor'});
            } else if (employeesFind) {
                res.send({ message: 'DPI ya utilizado'});
            } else {
                employees.name = params.name;
                employees.dpi = params.dpi;
                employees.sueldo = params.sueldo;
                employees.departamento = params.departamento;
                employees.horaEntrada = params.horaEntrada;
                employees.horaSalida = params.horaSalida;
                employees.phone = params.phone;
               
                employees.save((err, employeesSaved) => {
                    if (err) {
                        res.send({message: 'Error general'});
                    } else if (employeesSaved) {
                        res.send({employees: employeesSaved});
                    } else {
                        res.status(404).send({message: 'empleado no guardado' })
                    }
                });
            }
        });
    } else {
        res.send({ message: 'Ingrese todos los datos que se piden'});
    }
}


//Editar Empleado 
function updateEmployees(req, res) {
    var employeesId = req.params.id;
    var update = req.body;

    Employees.findByIdAndUpdate(employeesId, update, { new: true }, (err, employeesUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (employeesUpdated) {
            res.status(200).send({ employees_actualizado: employeesUpdated });
        } else {
            res.status(200).send({ message: 'Error al actualizar' });
        }
    });
}


// Eliminar Empleados
function deleteEmployees(req, res) {
    var employeesId = req.params.id;

    Employees.findByIdAndRemove(employeesId, (err, employeesDeleted) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (employeesDeleted) {
            res.status(200).send({ message: 'Empleados eliminados', employeesDeleted });
        } else {
            res.status(404).send({ message: 'Error al eliminar' });
        }
    });

}


// Listar Empleados 
function listEmployees(req, res) {
    Employees.find({}).exec((err, employees) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (employees) {
            res.status(200).send({ todos_los_employees: employees });
        } else {
            res.status(200).send({ message: 'No se obtuvieron datos' });
        }
    });
}


function findAllEmployees(req, res){
    Employees.find({}, {password:0, cuh:0}, (err, response)=>{
        if (err) {
            res.status(500).send({ message: "Error del servidor" });
        } else if (response) {
            res.send({ employees: response});
        } else {
            res.status(404).send({ message: "Sin employees que mostrar" });
        }
    })
}



// patrimonio de la empresa
function savePatrimony(req, res) {
    var patrimony = new Patrimony();
    var params = req.body;

    if( params.article_name && 
        params.serial && 
        params.cost && 
        params.descripcion){
            Patrimony.findOne({serial:params.serial}, (err, patrimonyFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                }else if(patrimonyFind){
                    res.send({message:' serial ya utilizado'});
                }else{
                    patrimony.article_name = params.article_name;
                    patrimony.serial = params.serial;
                    patrimony.cost = params.cost;
                    patrimony.descripcion = params.descripcion;
                   

                    patrimony.save((err, patrimonySaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error general al guardar'});
                        }else if(patrimonySaved){
                            res.send({patrimony: patrimonySaved});
                        }else{
                            res.status(418).send({message: 'Error al guardar'});
                        }
                    });

                }
            });
    }else{
        res.send({message: 'Ingrese todos los campos'});
    }

}


// Editar nombre de patrimonio
function updatePatrimony(req, res) {
    var patrimonyId = req.params.id;
    var update = req.body;

    Patrimony.findByIdAndUpdate(patrimonyId, update, { new: true }, (err, patrimonyUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (patrimonyUpdated) {
            res.status(200).send({ patrimony_actualizado: patrimonyUpdated });
        } else {
            res.status(200).send({ message: 'Error al actualizar' });
        }
    });
}


// Eliminar de pratrimonio 

function deletePatrimony(req, res) {
    var patrimonyId = req.params.id;

    Patrimony.findByIdAndRemove(patrimonyId, (err, patrimonyDeleted) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (patrimonyDeleted) {
            res.status(200).send({ message: 'datos eliminados', patrimonyDeleted });
        } else {
            res.status(404).send({ message: 'Error al eliminar' });
        }
    });

}



// Listar los patrimonios 
function listPatrimony(req, res) {
    Patrimony.find({}).exec((err, patrimony) => {
        if (err) {
            res.status(500).send({ message: 'Error in the server' });
        } else if (patrimony) {
            res.status(200).send({ todos_los_patrimony: patrimony });
        } else {
            res.status(200).send({ message: 'No se obtuvieron datos' });
        }
    });
}



function findAllPatrimony(req, res){
    Patrimony.find({}, {password:0, cuh:0}, (err, response)=>{
        if (err) {
            res.status(500).send({ message: "Error del servidor" });
        } else if (response) {
            res.send({ patrimony: response});
        } else {
            res.status(404).send({ message: "Sin patrimony que mostrar" });
        }
    })
}

module.exports = {
    saveAdmin,
    login,
    updateAdmin,
    deleteAdmin,
    saveProduct,
    updateProduct,
    deleteProduct,
    listProduct,
    saveEmployees,
    updateEmployees,
    deleteEmployees,
    listEmployees,
    controlStock,
    buscarProduct,
    productsAgotados,
    restarStoke,
    sumarStoke,
    savePatrimony,
    updatePatrimony,
    deletePatrimony,
    listPatrimony,
    findAll,
    findAllEmployees,
    findAllPatrimony
}