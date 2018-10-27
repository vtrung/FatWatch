var express = require('express');
const User = require('../models/user');

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
          if(err || u == null){
            res.redirect('/?error=failed login');
            return;
          }
          req.session.user_id = u._id;
          req.session.username = u.username;
          res.redirect('/');
      }
    )
  } else {
    res.redirect('/');
  }
})

module.exports = router;
