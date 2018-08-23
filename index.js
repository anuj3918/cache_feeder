const config = require('./config');
const context = require('./lib/context');
const feeder = require('./lib/feeder');

const init = options => {
	const { cacheConfig, libSettings } = options;

	// Override default settings
	settings = config.set(libSettings);

	// Gets cache layer
	const { type } = cacheConfig;
	const cache = require('./cache')[type];
	if (!cache) {
		reject({ err: new Error(`"Invalid type of cache passed: ${type}`), result: null });
	}
	cache.setConfig(cacheConfig);

	// Builds a context (useful settings and funcs) to be used anywhere in the package
	const ctx = {
		cache,
		settings,
		print: function(str) {
			if (this.settings.logProcesses) {
				console.log(str);
			}
		}
	};

	context.set(ctx);
	return feeder;
};

module.exports = init;
