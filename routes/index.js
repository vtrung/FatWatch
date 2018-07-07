var express = require('express');
var router = express.Router();
const Entry = require('../model/entry');

/* GET home page. */
router.get('/', function(req, res, next) {
  test();
  res.render('index', { title: 'FatWatch' });
});

/* test function */
function test(){
  console.log("test");
  var random = Number(Math.floor(Math.random() * 100));
  console.log(random);
  var newentry = new Entry({
    weight: random,
    datetime: Date.now()
  })
  console.log(newentry);

  newentry.save(function(err, entry){
      if(err){
          console.log(err);
          //return handleError(err);
      } else {
          console.log(entry);
      }
  });
}

module.exports = router;
