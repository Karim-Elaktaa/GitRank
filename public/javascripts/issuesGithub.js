var https = require('https');
var future = require('future');
var utils = require("./utils");

exports.getNumberOfIssues = function getNumberOfIssues(projectName, callback, iterator, currentPage, totalNbIssuesOpen, totalNbIssuesClosed) {
  projectName = typeof projectName !== 'undefined' ? projectName : "angular/angular.js";
  iterator = typeof iterator !== 'undefined' ? iterator : 0;
  currentPage = typeof currentPage !== 'undefined' ? currentPage : 1;
  totalNbIssuesOpen = typeof totalNbIssuesOpen !== 'undefined' ? totalNbIssuesOpen : 0;
  totalNbIssuesClosed = typeof totalNbIssuesClosed !== 'undefined' ? totalNbIssuesClosed : 0;

  var functionName = "getNumberOfIssues"
  // utils.printLog(functionName, 'launch function \n totalNbIssuesOpen = ' + totalNbIssuesOpen + '\n totalNbIssuesClosed = ' + totalNbIssuesClosed);
  console.log("...");

  var itemPerPage = 100;
  var options = {
    hostname: 'api.github.com',
    port: 443,
    path: '/repos/' + projectName + '/issues?state=all&per_page=' + itemPerPage + '&page=' + currentPage + "&" + utils.credentialApiTesting,
    method: 'GET',
    headers: {
      'User-Agent': 'Karim-Elaktaa'
    }
  };

  var req = https.request(options, function(res) {
    // utils.printLog(functionName, 'Status code = ' + res.statusCode)

    var buffer = "",
      data;
    var numberOfIssuesOpen = 0,
      numberOfIssuesClosed = 0,
      numberOfIssuesIncludingPR = 0;

    res.on('data', function(d) {
      // process.stdout.write(d);
      buffer += d;
    });

    res.on("end", function(err) {
      data = JSON.parse(buffer);
      numberOfIssuesIncludingPR = data.length;
      for (var i = 0; i < data.length; i++) {
        try {
          data[i].pull_request.url;
          // utils.printLog(functionName, 'PULL REQUEST ' + data[i].pull_request.url);
        }
        catch (err) {
          if (data[i].state == "open") {
            numberOfIssuesOpen++;
          }
          else {
            numberOfIssuesClosed++;
          }
          // utils.printLog(functionName, 'NOT PULL REQUEST');
        }
      }

      // numberOfItem = data.length;
      totalNbIssuesOpen += numberOfIssuesOpen;
      totalNbIssuesClosed += numberOfIssuesClosed;

      currentPage++;
      iterator++;
      if (numberOfIssuesIncludingPR == itemPerPage) {
        getNumberOfIssues(projectName, callback, iterator, currentPage, totalNbIssuesOpen, totalNbIssuesClosed);
      }
      else {
	var res = {openIssues: totalNbIssuesOpen, closedIssues: totalNbIssuesClosed, ratioOpenClosed: totalNbIssuesOpen/totalNbIssuesClosed};
	callback(res);
        // utils.printLog(functionName, '\n Total issues open ' + totalNbIssuesOpen + '\n Total issues closed ' + totalNbIssuesClosed + '\n Ratio Open/Closed ' + totalNbIssuesOpen / totalNbIssuesClosed);
      }
    });

  });


  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
}
