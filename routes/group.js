var express = require('express');
var router = express.Router();
const User = require('../model/user');
const Group = require('../model/group');
const GroupMember = require('../model/groupmember');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

router.get('/list', function(req, res, next){
    var user_id = req.session.user_id;
    Group.find({}, function(err, result){
        res.send(result);
    })
});

router.post('/create', function(req, res, next) {
    var groupid = req.body.groupid;
    var userid = req.body.userid;
    var group = CreateGroup(groupid, userid);
    if(groupid){
        group.save(function(err, group){
            if(err){
              req.errormsg = "test";
              console.log(encodeURIComponent('something that would break'));
              //res.redirect('/?Error=' + encodeURIComponent('something that would break'));
            }
            var gm = new GroupMember({
                groudid: group._id,
            })
            
            SaveGroupMember(group.groupid, userid, (err,gm)=>{
                console.log("saved groupmember also");
            });
            console.log("successfully saved");
            res.redirect('/');
          })
    } else {
        res.redirect('/');
    }
    
  });

  router.post('/add', function(req, res, next) {
    var groupid = req.body.groupid;
    var userid = req.body.userid;
    //var groupmember = CreateGroupMember(groupid, userid);
    var gm = SaveGroupMember(groupid, userid, function(err, gm){
        console.log(err);
        console.log(gm);
        res.redirect('/');
    });
    // Group.findOne({groudid: groupid}, function(err, g){
    //     if(err)
    //         res.redirect('/');
    //     if(g){
    //         User.findONe({username: userid}, function(err2, u){
    //             if(err2)
    //                 res.redirect('/');
    //         })
    //     } else {
    //         res.redirect('/');
    //     }
        
    // })
    // if(groupid){
    //     groupmember.save(function(err, gm){
    //         if(err){
    //           console.log(err);
    //         }
    //         console.log(gm);
    //         console.log("successfully saved");
    //         res.redirect('/');
    //       })
    // } else {
    //     res.redirect('/');
    // }
    
  });

// Construct Group
function CreateGroup(groupid, userid){
    var group = new Group({
        groupid: groupid,
        userid: userid
    })
    return group;
}

// Construct GroupMember
function CreateGroupMember(groupid, userid){
    var groupmember = new GroupMember({
        groupid: groupid,
        userid: userid
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


function GetGroupByGroupname(groupid, callback){
    Group.findOne({groupid: groupid}, (err, group) => {
        if(err){
            callback(err, null);
        } else {
            callback(err, group);
        }
    })
}

function GetUserByUsername(username, callback){
    User.findOne({username:username}, (err, user) => {
        if(err){
            callback(err, null);
        } else {
            callback(err, user);
        }
    })
}

module.exports = router;