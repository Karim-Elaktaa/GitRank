var express = require('express');
var Future = require('async-future');
var issuesGithub = require('../public/javascripts/issuesGithub');
var pullsGithub = require('../public/javascripts/pullsGithub');
var commitsGithub = require('../public/javascripts/commitsGithub');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'GitRank API testing',
    typeOfResults: 0,
    showResults: false
  });
});

router.post('/', function(req, res) {
  console.log(req.body);
  console.log('resultat: \n');

  if (req.body.inputCheckbox == 0) {
    issuesGithub.getNumberOfIssues(req.body.projectName, function(r) {
      console.log('Open ' + r.openIssues + ' Closed ' + r.closedIssues + ' Ratio ' + r.ratioOpenClosed);
      res.render('index', {
        title: 'GitRank API testing',
        typeOfResults: 0,
        showResults: true,
        projectName: req.body.projectName,
        results: {
          open: r.openIssues,
          closed: r.closedIssues,
          ratio: r.ratioOpenClosed
        }
      });
    });
  }
  else
  if (req.body.inputCheckbox == 1) {
    pullsGithub.getNumberOfPulls(req.body.projectName, function(r) {
      console.log('Open ' + r.openPulls + ' Closed ' + r.closedPulls + ' Ratio ' + r.ratioOpenClosed);
      res.render('index', {
        title: 'GitRank API testing',
        typeOfResults: 1,
        showResults: true,
        projectName: req.body.projectName,
        results: {
          open: r.openPulls,
          closed: r.closedPulls,
          ratio: r.ratioOpenClosed
        }
      });
    });
  }
  else
  if (req.body.inputCheckbox == 2) {
    commitsGithub.getCommitsInfo(req.body.projectName, function(r) {
      console.log('Date last commit ' + r.dateLastCommit + ' totalNbCommitsSince3M ' + r.totalNbCommitsSince3M);
      res.render('index', {
        title: 'GitRank API testing',
        typeOfResults: 2,
        showResults: true,
        projectName: req.body.projectName,
        results: {
          dateLastCommit: r.dateLastCommit,
          totalNbCommitsSince3M: r.totalNbCommitsSince3M,
        }
      });
    });
  }

});

module.exports = router;
