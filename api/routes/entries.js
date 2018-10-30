// entries.js
'use strict';

const express = require('express');
const router = express.Router();

const Entry = require('../../models/entry');
const User = require('../../models/user');
const Group = require('../../models/group');
const GroupMember = require('../../models/groupmember');
const Login = require('../../modules/login');

router.get('/', Login.checkAuth, function(req, res, next) {
    var result = Entry.find({user:req.user}, (err, entries)=>{
        if(err){
            res.send(err)
        } else {
            res.send(entries);
        }
    })
    //res.send(req.user);
});


module.exports = router;