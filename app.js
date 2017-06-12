var express = require('express');
var app = express();
var body_parser = require('body-parser');
var request = require('request');

// Loading tokens
var config = require('./config.js').getConfig();

// Import API.AI and identify with token
var apiai = require('apiai');
var api = apiai(config.apiaitoken);

// Import our own webhook functions
var apiaiUtils = require('./utils/apiaiutils.js');
var facebookUtils = require('./utils/facebookutils.js');

// Define port
app.set('port', (process.env.PORT || 5000));

// Parser for forms
var json_body_parser = body_parser.json();
var url_body_parser = body_parser.urlencoded({ extended: false });

// Webhook for Facebook - Subscription
app.get('/facebook', json_body_parser, function(request, response) {
    if ((request.query['hub.mode'] === 'subscribe')
    && (request.query['hub.verify_token'] === config.facebook.verification_token)) {
        console.log('Facebook webhook validated');
        response.status(200).send(request.query['hub.challenge']);
    } else {
        console.error('Failed Facebook webhook validation.');
        response.sendStatus(403);
    }
})

// Webhook for Facebook - handle message requests
app.post('/facebook', json_body_parser, function(req, response) {
    const data = req.body;
    if (data.object === "page") {
        data.entry.forEach(pageEntry => {
            pageEntry.messaging.forEach(messagingEvent => {
                if (messagingEvent.message) {
                    if (!messagingEvent.message.is_echo) {
                        facebookUtils.handleFacebookTextMessage(messagingEvent);
                    }
                }
            })
        })
    }
    response.sendStatus(200);
})

// Webhook for API.AI -  request for a fulfillment
app.post('/apiai', json_body_parser, function(request, response) {
    // API.AI requires help for a customized question
    apiaiUtils.fulfillmentRequest(request, response);
})

// Launching server
app.listen(app.get('port'), function() {
    console.log('Node app is running on port ', app.get('port'));
})
