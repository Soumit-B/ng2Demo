var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var port = process.env.PORT || 3030;
var four0four = require('./server/utils/404')();

var environment = process.env.NODE_ENV;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
}); 
app.use('/api', require('./server/routes'));


switch (environment) {
    case 'build':
        console.log('** BUILD **');
        app.use(express.static('./build/'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', function(req, res) {
            four0four.send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** DEV **');
        app.use(express.static('src'));
        // Any invalid calls for templateUrls are under app/* and should return 404
        app.use('/app/*', function(req, res) {
            four0four.send404(req, res);
        });
        // Any deep link calls should return index.html
        app.use('/*', express.static('src/index.html'));
        break;
}


app.listen(port, function() {
    console.log('************************');
    console.log('Listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '| PORT = ' + port +
        '| DIR = ' + __dirname +
        '| process.cwd() = ' + process.cwd());
    console.log('************************');
});