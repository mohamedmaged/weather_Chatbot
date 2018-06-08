var apiai = require('apiai');

var app = apiai("e92f37fadbcf41bb86e74895bed5711d");

var request = app.textRequest('temp in london', {
    sessionId: 'UNIQE SESSION ID'
});

request.on('response', function(response) {
    console.log(response.result.parameters.city);
});

request.on('error', function(error) {
    console.log(error);
});

request.end();
