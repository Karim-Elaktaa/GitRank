var https = require('https');
var future = require('future');
var utils = require("./utils");

exports.getNumberOfPulls = function getNumberOfPulls(projectName, callback, iterator, currentPage, totalNbPullsOpen, totalNbPullsClosed) {
  projectName = typeof projectName !== 'undefined' ? projectName : "angular/angular.js";
  iterator = typeof iterator !== 'undefined' ? iterator : 0;
  currentPage = typeof currentPage !== 'undefined' ? currentPage : 1;
  totalNbPullsOpen = typeof totalNbPullsOpen !== 'undefined' ? totalNbPullsOpen : 0;
  totalNbPullsClosed = typeof totalNbPullsClosed !== 'undefined' ? totalNbPullsClosed : 0;

  var functionName = "getNumberOfPulls"
    // utils.printLog(functionName, 'launch function \n totalNbPullsOpen = ' + totalNbPullsOpen + '\n totalNbPullsClosed = ' + totalNbPullsClosed);
  console.log("...");

  var itemPerPage = 100;
  var options = {
    hostname: 'api.github.com',
    port: 443,
    path: '/repos/' + projectName + '/pulls?state=all&per_page=' + itemPerPage + '&page=' + currentPage + "&" + utils.credentialApiTesting,
    method: 'GET',
    headers: {
      'User-Agent': 'Karim-Elaktaa'
    }
  };

  var req = https.request(options, function(res) {
    // utils.printLog(functionName, 'Status code = ' + res.statusCode)

    var buffer = "",
      data;
    var numberOfPullsOpen = 0,
      numberOfPullsClosed = 0;

    res.on('data', function(d) {
      // process.stdout.write(d);
      buffer += d;
    });

    res.on("end", function(err) {
      data = JSON.parse(buffer);
      for (var i = 0; i < data.length; i++) {
        if (data[i].state == "open") {
          numberOfPullsOpen++;
        }
        else {
          numberOfPullsClosed++;
        }
        // utils.printLog(functionName, 'NOT PULL REQUEST');
      }

      // numberOfItem = data.length;
      totalNbPullsOpen += numberOfPullsOpen;
      totalNbPullsClosed += numberOfPullsClosed;

      currentPage++;
      iterator++;
      if (numberOfPullsOpen + numberOfPullsClosed == itemPerPage) {
        getNumberOfPulls(projectName, callback, iterator, currentPage, totalNbPullsOpen, totalNbPullsClosed);
      }
      else {
        var res = {
          openPulls: totalNbPullsOpen,
          closedPulls: totalNbPullsClosed,
          ratioOpenClosed: totalNbPullsOpen / totalNbPullsClosed
        };
        callback(res);
        //utils.printLog(functionName, '\n Total Pulls open ' + totalNbPullsOpen + '\n Total Pulls closed ' + totalNbPullsClosed + '\n Ratio Open/Closed ' + totalNbPullsOpen / totalNbPullsClosed);
      }
    });

  });


  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
}
