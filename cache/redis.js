const settings = require('../config').set({});
const redis = require('redis');
const context = require('../lib/context');

let client,
	connOptions = {},
	commands = [];

const connect = () => {
	return new Promise((resolve, reject) => {
		const ctx = context.get();

		let connected = null;
		client = redis.createClient(connOptions);
		client.on('ready', () => {
			if (connected === null) {
				connected = true;
				ctx.print('Redis connected');
				resolve(client);
			} else {
				ctx.print('Redis reconnected');
				connected = true;
			}
		});

		client.on('end', err => {
			if (connected === null) {
				connected = false;
				reject('Error: ' + JSON.stringify(err));
			} else {
				ctx.print('\nRedis connection ended');
				connected = false;
			}
		});
	});
};

const buffer = (key, value) => {
	return new Promise((resolve, reject) => {
		const ctx = context.get();
		commands.push(['set', key, value]);
		resolve(commands);
	});
};
const set = () => {
	return new Promise((resolve, reject) => {
		const ctx = context.get();
		ctx.print('Executing commands');
		client.batch(commands).exec(function(err, replies) {
			commands = [];
			resolve(replies);
		});
	});
};

const size = cb => {
	client
		.multi()
		.dbsize()
		.exec((err, replies) => {
			cb(replies[0]);
		});
};

const flush = () => {
	return client.flushdb();
};

const close = () => {
	client.quit();
};

const setConfig = config => {
	connOptions = config;
};

module.exports = { connect, buffer, set, size, close, setConfig, flush };
