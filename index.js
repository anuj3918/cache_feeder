const config = require('./config');
const script = require('./script');

const init = options => {
	const { type, cacheConfig, libSettings } = options;

	// Override default settings
	settings = config.set(libSettings);

	// Builds a context (useful settings and funcs) to be used anywhere in the package
	const context = {
		cacheConfig,
		settings,
		print: function(str) {
			if (this.settings.logProcesses) {
				console.log(str);
			}
		}
	};

	script.setContext(context);

	return script.feed;
};

module.exports = init;
