const settings = require('../config').set({});

const redis = require('redis');
let client,
	commands = [];

const connect = (options, context) => {
	return new Promise((resolve, reject) => {
		let connected = null;
		client = redis.createClient(options);
		client.on('ready', () => {
			if (connected === null) {
				connected = true;
				context.print('Redis connected');
				resolve(client);
			} else {
				context.print('Redis reconnected');
				connected = true;
			}
		});

		client.on('end', err => {
			if (connected === null) {
				connected = false;
				reject('Error: ' + JSON.stringify(err));
			} else {
				context.print('Redis connection lost, ' + JSON.stringify(err));
				connected = false;
			}
		});
	});
};

const buffer = (key, value, context) => {
	return new Promise((resolve, reject) => {
		commands.push(['set', key, value]);
		resolve(commands);
	});
};
const set = context => {
	return new Promise((resolve, reject) => {
		context.print('Executing commands');
		client.batch(commands).exec(function(err, replies) {
			commands = [];
			resolve(replies);
		});
	});
};

module.exports = { connect, buffer, set };
