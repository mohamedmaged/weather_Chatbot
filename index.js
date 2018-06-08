'use strict'

/***keys and tokens***/
let token ="ae32e8a339a232df0393c4102d6282a9"
var key= "83bcd41b2f4711fda30600152d4d32f1"
var aikey= "e92f37fadbcf41bb86e74895bed5711d"

/***lib***/
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
//var weather = require('openweather-apis');
const app = express()
//var apiai = require('apiai');

/***conf***/
//var api = apiai(aikey);
/*weather.setLang('en');
weather.setUnits('metric');
weather.setAPPID(key);*/
app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

/***testFunc***/
app.get('/', function(req, res) {
	res.send("I am working")
})

/*** webhook AUth***/
app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === "maged") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})

//processText("temp in london")
/*** facebook webhook ***/
/*app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
      var respond = processText(text)
      sendText(sender,respond)
		}
	}
	res.sendStatus(200)
})
*/
/*** send msg ***/
function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

/*** dialoglfow text request ***/
/*function processText(text)
 {
  var req = api.textRequest('temp in cairo', {
      sessionId: 'UNIQE SESSION ID'
  });

  req.on('response', function(response) {
    var city =response.result.parameters.city ;
    var latitude = response.result.parameters.lat;
    var longitude = response.result.parameters.long;
    var country = response.result.parameters.country;
    console.log(response.result.parameters);
    return (getTemperature(city,country,latitude,longitude));
  });
  req.on('error', function(error) {
      console.log(error);
  });
  req.end();
}

/*** getTemperature ***/
/*function getTemperature (city,country,latitude,longitude)
{
  weather.setCoordinate(0,0); // set back to zero and zero so not to force weather to be set on last coordinate

  if(latitude!="" && longitude!="")
    weather.setCoordinate(latitude,longitude);
  if(city!="")
    weather.setCity(city);
  if(country!="" && city === "")
    weather.setCity(country);

  weather.getTemperature(function(err, temp){
   if(temp === 'undefined'){
     return;
   }
   console.log(temp);
   return temp;
})
}*/
app.listen(app.get('port'), function() {
	console.log("running: port")
})
