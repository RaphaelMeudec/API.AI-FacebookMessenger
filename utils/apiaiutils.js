function formatApiaiResponse(speech, displayText) {
    return {
        "speech": speech,
        "displayText": displayText,
        "source": "heroku"
    }
}


var fulfillmentRequest = function(request, response) {
    var body = request.body;
    if (!body | !body.result.action) {
        console.log('missing action in request.');
    } else {
        console.log('Valid fulfillment request received.');
        var action = body.result.action;
        var parameters = body.result.parameters;
        switch(body.result.action) {
            case 'guess.name':
                var json = formatApiaiResponse(speech='Your name is Bill.', displayText='Your name is Bill.')
                response.json(json);
                break;
        }
    }
}


module.exports = {
    fulfillmentRequest
}
