var express = require('express');
const User = require('../model/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next){
  res.render('user/index', { title: 'FatWatch'});
})

router.post('/login', function(req, res, next){
  console.log('Received POST Login');
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;
  if(username.length > 0){
    User.findOne(
      {
          'username':username,
          'password':password
      },
      (err, u) => {
          console.log("MEMBER");
          console.log(u);
          if(err){
            res.redirect('/');
          }
              
          req.session.user_id = u.username;
          res.redirect('/');
      }
    )
  } else {
    res.redirect('/');
  }
})

module.exports = router;
