const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const allActive = {};
var counter = 0;
wss.on('connection', function (ws) {
    counter++;
    allActive[counter] = ws;
});
module.exports = allActive;
