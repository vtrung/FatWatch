var express = require('express');
var router = express.Router();
const Entry = require('../model/entry');

/* GET home page. */
router.get('/', function(req, res, next) {
  //test();
  Entry.find({}, function(err, result){
    console.log(result);
    res.render('index', { title: 'FatWatch', entries: result, jsentries: JSON.stringify(result) });
  });
  //res.render('index', { title: 'FatWatch', entries: {} });
});

// POST submit entry form
router.post('/', function(req,res, next){
  console.log('received post request');
  console.log(req.body);
  if(req.body.weight){
    var entry = CreateEntry(req.body.weight);
    entry.save(function(err, entry){
      console.log(entry);
      console.log("successfully saved");
      res.redirect('/');
    })
  } else {
    res.redirect('/');
  }
  
})

/* constructor for new Entry */
function CreateEntry(weight){
  var current = Date.now();
  var newentry = new Entry({
    weight: weight,
    datetime: current
  })
  return newentry
}



module.exports = router;
