var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'GitRank API testing', showResults: false });
});

router.post('/search', function(req, res) {
  res.render('index', { title: 'GitRank API' , showResults: true});
  console.log(req.body);
});
module.exports = router;
