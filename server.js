var express = require('express')
var bodyParser = require('body-parser');
var fs = require('fs');
var parseurl = require('parseurl')
var session = require('express-session');
var weather = require("Openweather-Node")
var app = express();

app.use(express.static('client'));
app.use(session({
	secret: 'yadayadayadayadayada'
}))

weather.setAPPID("4a1298ed40a24c281f313628a32881f7");
weather.setCulture("us");
weather.setForecastType("daily");

var data = fs.readFileSync('test.json');
var stats = JSON.parse(data);

//Activity Post Request
app.post('/activity', postActivity);

function postActivity(req, res) {
	var sid = req.sessionID;
	var sess = req.session;
	var activity = {
		user_id: sess,
		session_id: sid
	};

var data = JSON.stringify(activity, null, 2);

fs.writeFile('test.json', data, finished, {'flags': 'a'});

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

app.listen(3000);
console.log('listening on port 3000');

