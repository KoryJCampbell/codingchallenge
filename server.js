var express = require('express')
var bodyParser = require('body-parser');
var fs = require('fs');
var parseurl = require('parseurl')
var session = require('express-session');
var weather = require("Openweather-Node");
var ip = require('ip');
var app = express();

// collect request info
var requests = [];
var requestTrimThreshold = 1000000;
var requestTrimSize = 100000;
app.use(function (req, res, next) {
	requests.push(Date.now());

	// now keep requests array from growing forever
	if (requests.length > requestTrimThreshold) {
		requests = requests.slice(0, requests.length - requestTrimSize);
	}
	next();
});

app.use(express.static('client'));
app.use(session({secret: 'yadayadayadayadayada'}))

//open-weather api variables
weather.setAPPID("4a1298ed40a24c281f313628a32881f7");
weather.setCulture("us");
weather.setForecastType("daily");


var data = fs.readFileSync('test.json');
var stats = JSON.parse(data);

//Activity Post Request
app.post('/activity', postActivity);

function postActivity(req, res) {
	var sid = req.sessionID;
	var user = ip.address();
	var date = Date();

	var activity = {
		user_id: user,
		session_id: sid,
		total_sessions: requests.length,
		total_sessions_per_day: date
		// total_users:
		// avg_session_per_user:
	};

	var data = JSON.stringify(activity, null, 2);

	
	// Write File Data to test.json
	fs.writeFile('test.json', data, finished, {
		'flags': 'a'
	});

	function finished(err) {
		reply = {
			reply: "error writing file"
		};
		res.send(reply);
	}
	res.sendStatus(200);
}

//Get Request for Stats
app.get('/stats', getStats);

function getStats(req, res) {
	res.send(stats);
}

// External Get Request
app.get('/external', getData);

function getData(req, res) {
	weather.now("LosAngeles,California", function (err, aData) {
		if (err) console.log(err);
		else {
			res.send(aData);
		}
	});
}

// Listen on port 3000
app.listen(3000);
console.log('listening on port 3000');