var https = require('https');
var future = require('future');
var utils = require("./utils");

exports.getCommitsInfo = function getCommitsInfo(projectName, callback, iterator, currentPage, totalNbCommits, dateLastCommit) {
  projectName = typeof projectName !== 'undefined' ? projectName : "angular/angular.js";
  iterator = typeof iterator !== 'undefined' ? iterator : 0;
  currentPage = typeof currentPage !== 'undefined' ? currentPage : 1;
  totalNbCommits = typeof totalNbCommits !== 'undefined' ? totalNbCommits : 0;
  dateLastCommit = typeof dateLastCommit !== 'undefined' ? dateLastCommit : 0;

  var functionName = "getCommitsInfo"
    // utils.printLog(functionName, 'launch function \n totalNbCommits = ' + totalNbCommits );
  console.log("...");

  var date = new Date();
  date.setMonth(date.getMonth() - 3)

  var itemPerPage = 100;
  var options = {
    hostname: 'api.github.com',
    port: 443,
    path: '/repos/' + projectName + '/commits?' + utils.credentialApiTesting + '&since=' + date.toISOString() + '&per_page=' + itemPerPage + '&page=' + currentPage,
    method: 'GET',
    headers: {
      'User-Agent': 'Karim-Elaktaa'
    }
  };

  var req = https.request(options, function(res) {
    // utils.printLog(functionName, 'Status code = ' + res.statusCode)

    var buffer = "",
      data;

    res.on('data', function(d) {
      // process.stdout.write(d);
      buffer += d;
    });

    res.on("end", function(err) {
      data = JSON.parse(buffer);
      if (data != 'undefined' && data.length >= 1) {
        if (currentPage == 1) {
          dateLastCommit = data[0].commit.committer.date;
        }
        totalNbCommits = totalNbCommits + data.length;
      }

      currentPage++;
      iterator++;

      if (data.length == itemPerPage) {
        getCommitsInfo(projectName, callback, iterator, currentPage, totalNbCommits, dateLastCommit);
      }
      else {
        var res = {
          dateLastCommit: dateLastCommit,
          totalNbCommitsSince3M: totalNbCommits
        };
        callback(res);
      }
    });

  });


  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
}