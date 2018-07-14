var express = require('express');
var router = express.Router();
const Entry = require('../model/entry');
const User = require('../model/user');
const Group = require('../model/group');


//Check Authentication and User Sessions
function checkAuth(req, res, next) {
  console.log("checkauth");
  console.log(req.session);
  if (!req.session.user_id) {
      //redirect to login
      res.render('login');
  } else {
      next();
  }
};

/* GET home page. */
router.get('/',checkAuth, function(req, res, next) {
  var userid = req.session.user_id;
  //console.log(req.query);
  var errmsg = req.query;
  Entry.find({userid:userid}, function(err, result){
    console.log(result);
    res.render('index', { title: 'FatWatch', entries: result, error: errmsg, jsentries: JSON.stringify(result) });
  });
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'FatWatch'});
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'FatWatch'});
});

router.get('/logout', function (req, res, next) {
  delete req.session.user_id;
  res.redirect('/');
});


// POST submit entry form
router.post('/', function(req,res, next){
  console.log('received post Entry');
  console.log(req.body);
  var userid = req.session.user_id;
  if(req.body.weight){

    var entry = CreateEntry(userid, req.body.weight);
    
    entry.save(function(err, entry){
      if(err)
        console.log(err);
      console.log(entry);
      console.log("successfully saved");
      res.redirect('/');
    })
  } else {
    res.redirect('/');
  }
})

// POST: Create User
router.post('/createuser', function(req,res,next){
  console.log('Received POST CreateUser');
  console.log(req.body);
  if(req.body.username){
    var user = CreateUser(req.body.username, req.body.password);
    user.save(function(err, u){
      if(err){
        console.log(err);
      }
      console.log(u);
      console.log("successfully saved");
      res.redirect('/');
    })
  } else {
    res.redirect('/');
  }
})

/* constructor for new Entry */
function CreateEntry(userid, weight){
  var current = Date.now();
  var newentry = new Entry({
    userid: userid,
    weight: weight,
    datetime: current
  })
  return newentry;
}

/* constructor for new User */
function CreateUser(username, password){
  var newuser = new User({
    username: username,
    password: password
  })
  return newuser;
}



module.exports = router;
