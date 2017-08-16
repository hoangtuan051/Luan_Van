var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  console.log("sdsdsd");
});

router.get('/sentences', function(req, res, next) {
  res.render('mainpage');
});

module.exports = router;
