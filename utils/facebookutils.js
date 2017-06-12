var request = require('request');
var config = require('../config.js').getConfig();

var apiai = require('apiai')
var api = apiai(config.apiaitoken);


var handleFacebookTextMessage = function(event) {
    var question = event.message.text;
    var sender_id = event.sender.id;
    var recipient_id = event.recipient.id;

    if (!question | !sender_id | !recipient_id) {
        console.log('Event is partially defined. Missing question, sender or recipient.');
    } else {
        var req_bot = api.textRequest(question, {
            sessionId: sender_id
        });

        req_bot.on('response', function(response_bot) {
            var text = response_bot.result.fulfillment.speech;
            var action = response_bot.result.action;

            replyMessage(sender_id, response_bot.result.fulfillment);
        });

        req_bot.on('error', function(error_bot) {
            console.log("Couldn't answer the question");
            console.log(error_bot);
            replyMessage(sender_id, 'Une erreur est survenue. Un opérateur va prendre le relais d\'ici peu.');
        })

        req_bot.end();
    }
}

// Send a message via the Facebook Graph API
var sendMessage = function(messageData) {
    request({
        uri: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: config.facebook.pageAccessToken },
        method: "POST",
        json: messageData
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            if (messageId) {
                console.log("Successfully sent message with id %s to recipient %s",
                messageId, recipientId);
            } else {
                console.log("Successfully called Send API for recipient %s",
                recipientId);
            }
        } else {
            console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
        }
    });
}

// Responds a message based on text and id of the receiver
var replyMessage = function(recipientId, fulfillment) {
    var speech = fulfillment.speech;
    if ((speech != undefined) & (speech != "")) {
        const messageData = {
            recipient: {
                id: recipientId,
            },
            message: {
                text: speech
            }
        }
        sendMessage(messageData);
    } else {
        console.log('Facebook message is either empty or undefined.');
    }
}

module.exports = {
    handleFacebookTextMessage
}
