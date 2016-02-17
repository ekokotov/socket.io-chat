"use strict";
const express = require('express');
const app = express();
const server = require('http').Server(app);
const CONFIG = require('./config.js');
const Chat = require('./server/server');
const io = require('socket.io')(server);
server.listen(CONFIG.PORT, () => {
    console.log("Listening port ", CONFIG.PORT);
});

// frontEnd
app.use('/', express.static(__dirname + '/client/'));
// static
app.use('/bower_components/', express.static(__dirname + '/bower_components/'));
//chat server
new Chat(io);
