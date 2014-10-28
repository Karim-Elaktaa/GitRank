var https = require("https");
var utils = require("./utils");

function getLimitAPI() {
    var functionName = "getLimitAPI"
    utils.printLog(functionName, 'launch function')
    
    var options = {
        hostname: 'api.github.com',
        port: 443,
        path: '/rate_limit' + "?" + utils.credentialApiTesting,
        method: 'GET',
        headers: {
            'User-Agent': 'Karim-Elaktaa'
        }
    };

    var req = https.request(options, function(res) {

        utils.printLog(functionName, 'Status code = ' + res.statusCode)

        var buffer = "",
            data;

        res.on('data', function(d) {
            // process.stdout.write(d);
            buffer += d;
        });

        res.on("end", function(err) {
            data = JSON.parse(buffer);
            var messageCore = "Core => limit :"+data.resources.core.limit+" / remaining : "+data.resources.core.remaining+" / reset : "+data.resources.core.reset+"\n"
            var messageSearch = "Search => limit :"+data.resources.search.limit+" / remaining : "+data.resources.search.remaining+" / reset : "+data.resources.search.reset+"\n"
            utils.printLog(functionName, messageCore + messageSearch);
        });
    });


    req.end();

    req.on('error', function(e) {
        utils.printLog(functionName, e)
    });
}

getLimitAPI();