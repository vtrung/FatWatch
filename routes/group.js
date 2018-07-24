var express = require('express');
var router = express.Router();
const User = require('../model/user');
const Group = require('../model/group');
const GroupMember = require('../model/groupmember');

/* GET users listing. */
router.get('/id/:id', function(req, res, next) {
    var groupname = req.params.id;
    GetGroupMembersByGroupId(groupname, function(err, result){
        console.log(result);
        res.render('group', { group: result});
    });
  });


router.get('/list', function(req, res, next){
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

router.post('/create', function(req, res, next) {
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
                    groud: gp._id,
                    creator: userid
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

  router.post('/add', function(req, res, next) {
    var groupname = req.body.groupname;
    var username = req.body.username;
    //var groupmember = CreateGroupMember(groupid, userid);
    var gm = SaveGroupMember(groupname, username, function(err, gm){
        console.log(err);
        console.log(gm);
        res.redirect('/');
    });
    
  });

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
    GetGroupByGroupname(groupid, (err, group) => {
        if(err){
            console.log("Error: group not found: " + groupid);
            callback(err, null);
            return;
        } 
        if(group != null){
            var group_id = group._id;
            GetUserByUsername(userid, (uerr, user) => {
                if(uerr){
                    callback(uerr, null);
                    return;
                }
                if(user != null){
                    var user_id = user._id
                    var gm = CreateGroupMember(group_id, user_id);
                    gm.save((gmerr,gmres) => {
                        callback(gmerr, gmres);
                        return;
                    })
                } else {
                    callback(uerr, null);
                    return;
                }
            })
        } else {
            callback(err, null);
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