'use strict';

const express = require('express');
const router = express.Router();

const Entry = require('../../models/entry');
const User = require('../../models/user');
const Group = require('../../models/group');
const GroupMember = require('../../models/groupmember');

//Check Authentication and User Sessions
function checkAuth(req, res, next) {
    //console.log("checkauth");
    //console.log(req.session);
    if (!req.session.user_id) {
        //redirect to login
        //res.render('login');
        res.send("Not Authorized");
    } else {
        next();
    }
  };

/* GET users listing. */
router.get('/id/:id',checkAuth, function(req, res, next) {
    var groupid = req.params.id;
    GetGroupMembersByGroupId(groupid, function(err, gm){
        console.log(gm);
        GetGroupById(groupid, function(err, g){
            var list = UserConvertToList(gm);
            //res.render('group', { groupmembers: gm, group:g});
            console.log(list);
            Entry.find({
                'user':{$in: list}
            }, (err, e) =>{
                console.log(e);
                res.render('group', { groupmembers: gm, group:g, entries:JSON.stringify(e)});
            });
            
        })
        //res.render('group', { group: result});
    });
  });


router.get('/list',checkAuth, function(req, res, next){
    var user_id = req.session.user_id;
    console.log(user_id);
    GetUserGroups(user_id, function(err, result){
        if(err){
            console.log("error");
            res.send({});
        } else {
            res.send(result);
        }
        
    })
});

router.post('/create',checkAuth, function(req, res, next) {
    var groupname = req.body.groupname;
    var userid = req.session.user_id;
    var group = CreateGroup(groupname, userid);
    if(groupname){
        group.save(function(err, gp){
            if(err){
              req.errormsg = "test";
              console.log(err);
              console.log(encodeURIComponent('something that would break'));
              //res.redirect('/?Error=' + encodeURIComponent('something that would break'));
            } else {
                var gm = new GroupMember({
                    group: gp._id,
                    user: userid
                })
                gm.save(function(err, result){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("successfully saved");
                    }
                })
            }
            res.redirect('/');
          })
    } else {
        res.redirect('/');
    }
    
  });

  router.post('/add',checkAuth, function(req, res, next) {
    //var groupname = req.body.groupname;
    var username = req.body.username;
    var groupid = req.body.groupid;
    //var groupmember = CreateGroupMember(groupid, userid);
    var gm = SaveGroupMember(groupid, username, function(err, gm){
        console.log(err);
        console.log(gm);
        res.redirect('/');
    });
    
  });

function UserConvertToList(userlist){
    var list = [];
    console.log("userlist");
    console.log(userlist);
    userlist.forEach((u)=>{
        console.log("U");
        console.log(u);
        if(u){
            console.log("push" + u._id);
            list.push(u._id);
        }
    })
    console.log("finished list");
    console.log(list);
    return list;
}
// Construct Group
function CreateGroup(groupid, userid){
    var group = new Group({
        groupname: groupid,
        creator: userid
    })
    return group;
}

// Construct GroupMember
function CreateGroupMember(groupid, userid){
    var groupmember = new GroupMember({
        group: groupid,
        user: userid
    })
    return groupmember
}

// Save GroupMember
function SaveGroupMember(groupid, userid, callback){

    GetUserByUsername(userid, (uerr, user) => {
        if(uerr){
            callback(uerr, null);
            return;
        }
        if(user != null){
            var user_id = user._id
            var gm = CreateGroupMember(groupid, user_id);
            gm.save((gmerr,gmres) => {
                callback(gmerr, gmres);
                return;
            })
        } else {
            callback(uerr, null);
            return;
        }
    })
}

// function GetUsersByGroup(groupid, callback){
//     GetGroupByGroupname(groupid, function(err, group){
//         if(group){

//         }
//     })
// }

// function GetMembersByGroup(groupid, callback){
//     GroupMember.find({groupid:groupid}, function(err, gms){
//         console.log(gms);
//         var user_ids = [];
//         for(var i = 0; i < gms.length; i++){
//             user_ids.push(gms[0].userid);
//         }
//         GerUsersInList(user_ids, function(err, list){
//             console.log(list);
//         });

//     })
// }


function GetUserByUsername(username, callback){
    User.findOne({username:username}, (err, user) => {
        if(err){
            callback(err, null);
        } else {
            callback(err, user);
        }
    })
}

function GetUsersInList(useridlist, callback){
    User.find({
            '_id':{$in: useridlist}
    }, function(err, result){
        if(err || result.length < 1)
            callback(err, null);
        else
            callback(err, result);
    });
}
function GetGroupByGroupname(groupname, callback){
    console.log("GetGroupByGroupname");
    console.log(groupname);
    Group.findOne({groupname:groupname}, (err, group)=>{
        if(err || group.length < 1){
            callback(err, null);
        } else {
            callback(err, group);
        }
    })
}

function GetGroupById(groupid, callback){
    Group.findById(groupid, (err, res)=>{
        if(err){
            callback(err, null); 
        } else {
            callback(err, res);
        }
    })
}

function GetGroupMembersByGroupId(groupid, callback){
    
    GroupMember.find({group:groupid}, (err, res) => {
        if(err || res.length < 1){
            callback(err, null);
        } else {
            var list = [];
            res.forEach((gm) => {
                if(gm.user){
                    list.push(gm.user);
                }
            })
            GetUsersInList(list, callback);
        }
    })
}



// functions for get list of groups
function GetUserGroups(userid, callback){

    if(!userid){
        console.log("userid is null: " + userid);
        callback("userid is null", null);
        return;
    }
        
    GroupMember.find({user:userid}, (err, res) => {
        console.log(res);
        if(err || res.length < 1){
            callback(err, null);
        } else {
            //callback(err, res);
            var list = [];
            res.forEach((gm) => {
                if(gm.group){
                    list.push(gm.group);
                }
            })
            GetGroupNamesFromGroupIdList(list, callback);
        }
    });
}

function GetGroupNamesFromGroupIdList(list, callback){
    Group.find({
        '_id':{$in: list}
    }, (err, res) =>{
        console.log(res);
        if(err || res.length < 1){
            callback(err, null);
        } else {
            callback(err, res);
        }
    });
}


module.exports = router;