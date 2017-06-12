var express = require('express');
var app = express();
var body_parser = require('body-parser');
var request = require('request');

// Loading tokens
var config = require('./config.js').getConfig();

// Import API.AI and identify with token
var apiai = require('apiai');
var api = apiai(config.apiaitoken);

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
    response.sendStatus(200);
    const data = req.body;
    if (data.object === "page") {
        data.entry.forEach(pageEntry => {
            pageEntry.messaging.forEach(messagingEvent => {
                if (messagingEvent.message) {
                    if (!messagingEvent.message.is_echo) {
                        botHandler.handleMessage(messagingEvent, "Facebook");
                    }
                }
            })
        })
    }
})

// Launching server
app.listen(app.get('port'), function() {
    console.log('Node app is running on port ', app.get('port'));
})
