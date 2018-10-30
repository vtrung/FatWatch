'use strict'

const express = require('express');
const User = require('../../models/user');
const Pass = require('../../models/password');
const Login = require('../../modules/login');

const router = express.Router();

router.get('/', Login.checkAuth, function(req, res, next) {
  res.send(req.user);
});

router.post('/', function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({
        'username':username
    }, (err, u) => {
        if(err || u == null){
            res.send({status:"failed login"});
            //next();
        }
        console.log(u);
        Pass.findOne({user:u._id}, (err, pass)=>{
            if(err || pass == null){
                res.send({status:"failed login"});
                //next();
            }

            res.send(pass, password, {
                issuer: req.ip
            })
        })
            
    })
});

//changing passwords
router.put('/', function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    
    User.findOne({'username':username},(err, u)=>{
            if(err){
                console.log(err);
                res.send(err);
                return;
            }

            Pass.findOne({user:u._id}, (err, pass)=>{
                if(err){
                    console.log(err);
                    next();
                }
                ///PENDING -- RANDOMLY GENERATE SALT
                var salt = "secret";
                if(pass != null){
                    console.log("updatepass");
                    pass.salt = salt;
                    pass.password = Auth.hash(password, salt);
                    pass.save(function(err2, pu){
                        res.send(u);
                    });
                } else {
                    console.log("newpass");
                    var newpass = new Pass({
                        salt:salt,
                        password:Auth.hash(password, salt),
                        user:u._id
                    })
                    newpass.save(function(err2, pu){
                        res.send(u);
                    })
                }
            })
            
        });

});

// CREATE NEW USER
router.post('/create',(req,res, next)=>{
    var username = req.body.username;
    var password = req.body.password;
    var user = new User({
        username:username
    });
    user.save((err, u) => {
        if(err){
            res.send("failed");
        } else {
            ///PENDING -- RANDOMLY GENERATE SALT
            var salt = "secret";
            var newpass = new Pass({
                salt:salt,
                password:Auth.hash(password, salt),
                user:u._id
            })
            newpass.save((err2, pu) => {
                if(err){
                    res.send("failed");
                }
                res.send(u);
            })
        }
    })
})

router.get('/test',(req, res, next)=>{
    // var user = "vtrung";
    // Entry.find({user:'5b4d98406a97d114a3e707bf'})
    // .populate('user')
    // .exec(function(err, doc){
    //     console.log(doc);
    //     res.send(doc);
    // })

    console.log("--- Signing ---");
    var token = Auth.sign({test:"yes"},{});
    console.log(token);

    console.log("--- Verifying ---");
    console.log(Auth.verify(token, {}));

    console.log("--- Decoding ---");
    console.log(Auth.decode(token));
    res.send("done");
})

router.use(function(err, req, res, next){
    console.log("user route error");
    console.log(err);
    next();
});

module.exports = router;