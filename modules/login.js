'use strict'

const Auth = require('../modules/auth');
const User = require('../models/user');

module.exports = {
    checkAuth: (req, res, next) => {
        var token = req.headers.auth;
        //console.log(req.ip);
        console.log(req.headers);
    
        var verify = Auth.verify(token, {
            issuer:  req.ip
        });
    
        if (token && verify) {
            console.log(verify);
            User.findById(verify.user, (err, user)=>{
                if(err){
                    res.send({status: 'not authorized'});
                }
                console.log(user);
                req.user = user;
                next();
            })
        } else {
            res.send({status: 'not authorized'});
        }
    },

    validateUser: ( passworddoc, password, payload) => {
        if(pass.password == Auth.hash(password, passworddoc.salt)){
            var token = Auth.sign({user: passwordoc.user}, payload);
            //console.log(token);
            return token;
        } else {
            return {status:"failed login"};
            //next();
        }
    }



}