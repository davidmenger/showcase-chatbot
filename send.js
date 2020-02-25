const request = require('request-promise-native');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// configuration
const SECRET = 'foo';
const APP_ID = 'erste-showcase-app';
const CHANNEL_ID = 'fd792110-57e6-11ea-a99f-91f9be03d831';
const SEND_API_URL = 'https://webchat.csast.csas.cz/api/send';

module.exports = async function send (event) {
    const body = JSON.stringify(event);

    // make a body signature
    const hash = crypto.createHmac('sha1', SECRET);
    const sha1 = hash.update(body)
        .digest('hex');

    // create a JWT token
    const token = jwt.sign({
        appId: APP_ID,
        cid: CHANNEL_ID,
        sha1,
        t: 'a'
    }, SECRET);

    // send the request
    try {
        await request({
            url: SEND_API_URL,
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8',
                Authorization: token
            },
            body,
            json: false
        });

        console.log('#SENT', body);
    } catch (e) {
        console.error('#SEND_FAILED', e, body);
    }


}