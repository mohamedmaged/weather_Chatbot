'use strict'

/***Global variables , keys and tokens***/
let token ="EAAeGNZBbhP1wBALzadtj7X4a07UgEsUZB3oVojexl1qIdhIAsAZBhrNEsBLdlPEtBB6yUQKNCYdfs3kSWSbVcE6qRGxhNcwjbdHEI9STkyHIoDrWPn8w9M6ZCzm8ZCheGLQuFJAC1rkStQG24BRHDjHGuZCzMntUcneMtpr4YNy0AEHYwuWBLZC"
var key= "83bcd41b2f4711fda30600152d4d32f1"
var aikey= "e92f37fadbcf41bb86e74895bed5711d"
/*let locData =  [
		{
			content_type : "location",
			title : "get location",
			payload : "location_for_developer"
		}
	]*/

/***lib***/
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
var weather = require('openweather-apis');
const app = express()
var apiai = require('apiai');

/***conf***/
var api = apiai(aikey);
weather.setLang('en');
weather.setUnits('metric');
weather.setAPPID(key);
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

/*** facebook webhook ***/
app.post('/webhook/', function(req, res) {
	console.log("event message");
	console.log(event.message);
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
      console.log("receive t : "+text);
      processText(sender,text)
		}
		if(event.message.attachments){
			var latitude = 0;
			var longitude = 0 ;
			if(event.message.attachments[0].payload.coordinates)
			{
				latitude = event.message.attachments[0].payload.coordinates.lat ;
				longitude = event.message.attachments[0].payload.coordinates.long ;
				getTemperature(sender,0,0,latitude,longitude)
			}
		}
	}
	res.sendStatus(200)
})

/*** send msg ***/
function sendText(sender, sText) {
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message :{
        text:sText ,
      }
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

function sendPayload(sender)
{
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message :{
        text:"please give me your location" ,
        quick_replies :[
						{
							content_type : "location",
							title : "get location",
							payload : "location_for_developer"
						}
					]
      }
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
function processText(sender,text)
 {
   console.log("process text :" + text);
  var req = api.textRequest(text, {
      sessionId: 'UNIQE SESSION ID'
  });

  req.on('response', function(response) {
		console.log(" all response ");
		console.log(response);
		console.log(" all result ");
		console.log(response.result);
		if(response.result.metadata.intentName === "weather")
		{
    var city =response.result.parameters.city ;
    var latitude = response.result.parameters.lat;
    var longitude = response.result.parameters.long;
    var country = response.result.parameters.country;
    console.log(response.result.parameters);
	}
		if(!city && !latitude && !longitude && !country)
		{
			sendPayload(sender)
		}
		elsey

    getTemperature(sender,city,country,latitude,longitude)

  });
  req.on('error', function(error) {
      console.log(error);
  });
  req.end();
}

/*** getTemperature ***/
function getTemperature (sender,city,country,latitude,longitude)
{
  var w = "The temp in " ;
  weather.setCoordinate(0,0); // set back to zero and zero so not to force weather to be set on last coordinate

  if(latitude!="" && longitude!=""){
    weather.setCoordinate(latitude,longitude);
    w=w+"latitude : "+latitude+" longitude : "+longitude;
  }
  if(city!=""){
    weather.setCity(city);
    w=w+city;
  }
  if(country!="" && city === ""){
    weather.setCity(country);
    w=w+country;
  }
  weather.getTemperature(function(err, temp){
   if(temp === 'undefined'){
     return;
   }
   else {
   console.log(temp);
   w=w+" is "+ temp + " Celesius .";
   sendText(sender,w)
 }
})
}
app.listen(app.get('port'), function() {
	console.log("running: port")
})
