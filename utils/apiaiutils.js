



var fulfillmentRequest = function(request, response) {
    var body = request.body;
    if (!body | !body.result.action) {
        console.log('missing action in request.');
    } else {
        console.log('Valid fulfillment request received.');
        var action = body.result.action;
        var parameters = body.result.parameters;
        // switch(body.result.action) {
        //
        // }
    }
}


module.exports = {
    fulfillmentRequest
}
