'use strict';
const Config = require('../config.js');

class JoinEventHandler {
	constructor(io, client, totalUsers) {
		this.io = io;
		this.client = client;
		this.userCount = totalUsers;
	}

	onJoin() {
		let uid = Math.random() * 10;
        this.client.join(Config.DEFAULT_ROOM);
        this.userCount ++;
        this.client.emit('connected', {
        	id: uid,
        	text: "You Are connected. Hi !",
        	time: new Date().toJSON(),
        	totalUsers: this.userCount
     	});

     	this.client.broadcast.emit('new:user', {
			time: new Date().toJSON(),
        	totalUsers: this.userCount
	    });
	}

	onDisconect() {
	    this.client.emit('disconnect:user', {
	    	//id: uid,
	    	time: new Date().toJSON(),
	    	totalUsers: -- this.userCount
	     });
		console.log('user disconnected');
	}
}

module.exports = JoinEventHandler;