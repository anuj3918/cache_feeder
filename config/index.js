const _ = require('lodash');

let settings = {
	keyColName: 'key',
	valueColName: 'value',
	logProcesses: true,
	logTime: true,
	commandsPerBatch: 100
};

const set = libSettings => {
	// Overwrite default settings
	Object.assign(settings, libSettings);

	return settings;
};

module.exports = {
	set
};
