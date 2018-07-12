var express = require('express');
var router = express.Router();
const Group = require('../model/group');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });

router.get('/list', function(req, res, next){
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
              console.log(err);
            }
            console.log(group);
            console.log("successfully saved");
            res.redirect('/');
          })
    } else {
        res.redirect('/');
    }
    
  });


// Construct Group
function CreateGroup(groupid, userid){
    var group = new Group({
        groupid: groupid,
        userid: userid
    })
    return group;
}

module.exports = router;