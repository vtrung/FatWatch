var express = require('express');
var router = express.Router();
const User = require('../model/user');
const Group = require('../model/group');
const GroupMember = require('../model/groupmember');

/* GET users listing. */
router.get('/:groupname', function(req, res, next) {
    //res.send('respond with a resource');
    //res.send(req.params)
    console.log(req.params.groupname);
    var groupname = req.params.groupname;
    GetGroupByGroupname(groupname, function(err, result){
        console.log(result);
        res.render('group', { group: result});
    });
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

function GetUsersByGroup(groupid, callback){
    GetGroupByGroupname(groupid, function(err, group){
        if(group){

        }
    })
}

function GetMembersByGroup(groupid, callback){
    GroupMember.find({groupid:groupid}, function(err, gms){
        console.log(gms);
        var user_ids = [];
        for(var i = 0; i < gms.length; i++){
            user_ids.push(gms[0].userid);
        }
        GerUsersInList(user_ids, function(err, list){
            console.log(list);
        });

    })
}
function GetGroupByGroupname(groupid, callback){
    console.log("get group by groupname");
    console.log(groupid);
    Group.findOne({groupid:groupid}, (err, res) => {
        if(err){
            console.log(err);
            callback(err, null);
        } else {
            console.log(res);
            callback(err, res);
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

function GetUsersInList(useridlist, callback){
    User.find({
            '_id':{$in: useridlist}
    }, function(err, result){
        console.log(result);
        callback(err, result);
    });
}

module.exports = router;