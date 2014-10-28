exports.printLog = function printLog(functionName, message) {
    functionName = typeof functionName !== 'undefined' ? functionName : 'NoName';
    message = typeof message !== 'undefined' ? message : 'NoMessage';
    console.log('Function: ' + functionName);
    console.log('Message: ' + message + '\n');

}
exports.PORT = process.env.PORT;
exports.IP = process.env.IP;
//security
exports.credentialApiTesting = "client_id=81d4eea271c2eceb1e2a&client_secret=384f1e14ff027359f555ffc80e01bd65f557576f"