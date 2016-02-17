'use strict';

class MessageHandler {
	constructor(io, client) {
		this.io = io;
		this.client = client;
	}

	onMessage(message) {
		console.log(message);
		this.client.broadcast.emit('new:message', message);
	}
}

module.exports = MessageHandler;