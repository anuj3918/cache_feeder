const config = require('./config');
const script = require('./script');

const init = params => {
	const { type, path, cacheConfig, libSettings } = params;

	// Override default settings
	settings = config.set(libSettings);

	const context = {
		settings,
		print: function(str) {
			if (this.settings.logProcesses) {
				console.log(str);
			}
		}
	};

	script(type, path, cacheConfig, context);
};

module.exports = init;
