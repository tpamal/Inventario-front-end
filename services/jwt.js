"use strict"

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'clave_secreta';

exports.createToken = (user)=>{
    var payload ={
        sub: user._id,
        name: user.name,
        iat: moment().unix(),
        exp:moment().day(30, 'day').unix() 
    };
    return jwt.encode(payload, key);  
}
