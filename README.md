# API.AI-FacebookMessenger

## How does it work ?

1. You want to create an API.AI agent, add a few questions to it, and retrieve the access token. Fill config.js with it.
2. You can now make a test by deploying locally this NodeJs app, going to the root page (localhost:port/) and fill in the input text with a question that your bot can answer. You should get an answer if it's connected.
3. You want to create a Facebook Page, and link this Facebook page to a Facebook application
4. You should be able to retrieve the Verification access token and the Page access token, and fill config.js
5. To test the connection to Facebook Messenger, you first need to have to deploy the app, to Heroku for example or by using Ngrok
6. Once you have an address to your app, you want to connect your Facebook app to messenger, and also add a webhook redirecting to the address (don't forget to add the /facebook as it is where the webhook is implemented, for example on Heroku : stark-escarpment-XXXXX.herokuapp.com/facebook)
7. If you want everybody to be able to talk to your bot, you need to ask Facebook permissions. If you just want to test for yourself, you can add your personal account as a developer of the app, and talk to the page from your personal account. It should answer automatically now.

## Specific fulfillments for API.AI

Sometimes, a static response from the bot is not enough. For example, if you want to know what is the color of the dog name Bill, you want to check out in a database what is his color. For now, you are not able to do that, as you are just requiring answers to API.AI, and API.AI is not asking you anything. The fulfillment is exactly what you need.

1. On the API.AI dashboard, in the fulfillment section, click enable and add the url address (we will use something similar to the previous facebook url, such as stark-escarpment-XXXXX.herokuapp.com/apiai).
2. Add an intent as usual in your bot on API.AI. You can also import my zip file into your API.AI account. It contains an intent responded by the server.
3. At the bottom of this intent, in the fulfillment part, click "Use Webhook"
4. Now is the time to configure our back-end to handle that kind of requests. On app.js, add a handler for apiai/

```javascript
// Webhook for API.AI -  request for a fulfillment
app.post('/apiai', json_body_parser, function(request, response) {
    // API.AI requires help for a customized question
    fulfillmentRequest(request, response);
})
```

5. Your fulfillmentRequest should take into account the action name you gave to handle these specific request, and then then send back a json:

```javascript
return response.json({
            speech: "Action todo",
            displayText: "Action todo",
            source: "webhook-heroku"
        })
```

6. Back to our example : We set the action name as colorByName. We also want that the name Bill gets to the back-end with the request. So we add a parameter @sys.any on Bill, add multiple input questions to make sure that API.AI recognizes the name and pass it as a parameter. On the back-end, in the fulfillmentRequest method, you read the action name, make a special case for 'colorByName', and access the database and return the appropriate message. For example :

```javascript
return response.json({
            speech: "The color is " + databaseGetColorByName(parameters.name),
            displayText: "The color is " + databaseGetColorByName(parameters.name),
            source: "webhook-heroku"
})
```

<b>Note</b>: This example hasn't been implemented in the code. Moreover, getting value from a database should be done asynchronously.


## Useful links

Facebook Webhook : https://developers.facebook.com/docs/graph-api/webhooks  
API.AI fulfillment : https://docs.api.ai/docs/webhook  
Set up an Heroku application : https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction  
Interesting API.AI project from forum : https://discuss.api.ai/t/food-delivery-bot-v2-lots-of-fixes/3478
