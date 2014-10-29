var express = require('express');
var Future = require('async-future');
var issuesGithub = require('../public/javascripts/issuesGithub');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'GitRank API testing', showResults: false });
});

router.post('/', function(req, res) {
  console.log(req.body);
  console.log('resultat: \n');
  issuesGithub.getNumberOfIssues(req.body.projectName, function(r){
  	console.log('Open '+ r.openIssues + ' Closed '+ r.closedIssues + ' Ratio '+r.ratioOpenClosed);
  	res.render('index', { title: 'GitRank API testing' , showResults: true, projectName: req.body.projectName, results: {open: r.openIssues, closed: r.closedIssues, ratio: r.ratioOpenClosed} });
  });
});

module.exports = router;
