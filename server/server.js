'use strict';
const MessageHandler = require('./MessageHandler.js');
const JoinEventHandler = require('./JoinEventHandler.js');

class ChatServer {
   constructor(io) {
    this.totalUsers = 0;
    io.on('connection', client => {
        this.totalUsers ++;
        this.client = client;
        this.messageHandler = new MessageHandler(io, client);
        this.joinHandler = new JoinEventHandler(io, client, this.totalUsers);
        this.registerEvents();
        this.joinHandler.onJoin();
    });

   }

   registerEvents() {
     this.client.on('disconnect', () => {
        this.totalUsers --;
        this.joinHandler.onDisconect();
    });
    this.client.on('send:message', (message) => this.messageHandler.onMessage(message));
   }
}

module.exports = ChatServer;
