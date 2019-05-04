'use strict'

const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');

// PRIVATE and PUBLIC key
var privateKey  = fs.readFileSync('./ignore/jwtRS256.key', 'utf8');
var publicKey  = fs.readFileSync('./ignore/jwtRS256.key.pub', 'utf8');

module.exports = {
    //sign token
    sign: (payload, options) => {
        var signOptions = {
            issuer:  options.issuer,
            expiresIn:  "5m",    // 30 days validity
            algorithm:  "RS256"    
        };
        var token = jwt.sign(payload, privateKey, signOptions);
        console.log(token);
        return token;
    },

    //verify token
    verify: (token, options) => {
        var verifyOptions = {
            issuer:  options.issuer,
            expiresIn:  "5m",
            algorithm:  "RS256"
        };

         try{
           return jwt.verify(token, publicKey, verifyOptions);
         }catch (err){
           return false;
         }
    },

    decode: (token) => {
        return jwt.decode(token, {complete: true});
    },

    hash: (password, salt) =>{
        console.log("hashing");
        console.log(password);
        var hashed = crypto.createHash('md5').update(password+salt).digest('hex');
        console.log(hashed);
        return hashed;
    }

};

