const express = require('express');
const send = require('./send');

const app = express();

app.get('/', (req, res) => res.send('Up and running!'));

app.post('/', express.json(), (req, res) => {
    // extract the incomming event
    const [entry] = req.body.entry;
    const [event] = entry.messaging;

    console.log('#RECEIVED', JSON.stringify(event, null, 2));

    // if the incomming event is a text
    if (event.message && event.message.text) {
        const { text } = event.message;

        // if user sends a greeting
        if (text.match(/hello/)) {

            send({
                recipient: {
                    id: event.sender.id
                },
                message: {
                    text: 'Hello, welcome!'
                }
            })
        } else {
            // in any other case (fallback)
            send({
                recipient: {
                    id: event.sender.id
                },
                message: {
                    text: `Sorry, I do not understand "${text}" :/`
                }
            })
        }
    }

    res.send('EVENT RECEIVED');
});

app.listen(3000);
