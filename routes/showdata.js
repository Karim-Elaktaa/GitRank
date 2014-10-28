var express = require('express');
var router = express.Router();

/* GET test. */
router.get('/', function(req, res) {
  res.render('showdata', { title: 'Show data'});
});

module.exports = router;
