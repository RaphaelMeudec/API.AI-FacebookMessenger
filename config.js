const config = {}

config.apiaitoken = 'apiai token'

config.facebook = {
    verification_token : 'Your verification token',
    pageAccessToken : 'You page access token'
}

module.exports = config
module.exports =
{
    getConfig: function() {
        return config;
    }
};
