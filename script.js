var csv = require('csv-parser');
var fs = require('fs');

const script = async (type, path, cacheConfig, context) => {
	// Destructs context
	const { print, settings } = context;

	// Connect to cache
	const cache = require('./cache')[type];
	const client = await cache.connect(
		cacheConfig,
		context
	);

	var lineCount = 0;
	var paused = false;
	var totalLines = 0;
	var batchNum = 0;

	if (settings.logTime) {
		console.time('Processing_time');
	}

	var x = fs
		.createReadStream(settings.path)
		.pipe(csv())
		.on('data', async function(data) {
			var line = JSON.parse(JSON.stringify(data));

			const { keyColName, valueColName } = settings;

			if (!line[keyColName] || !line[valueColName]) {
				console.log(`Erroneous column names: ${keyColName}, ${valueColName}`);
				console.log(`Row received: ${JSON.stringify(line)}`);
				process.exit(1);
			}

			totalLines++;
			if (!paused && lineCount < settings.commandsPerBatch) {
				// Increment line counter
				lineCount++;

				// Set the buffer in cache to be processed later at once (kindof batch request)
				let commands = await cache.buffer(line[keyColName], line[valueColName], context);
			}
			if (!paused && lineCount >= settings.commandsPerBatch) {
				// Increment batch counter
				batchNum++;

				// Pause stream till keys are set in cache
				x.pause();
				paused = true;
				print(`\nPausing stream\nInserting batch number : ${batchNum}`);

				// Cache call
				let result = await cache.set(context);

				// Log Results
				print(`Result of batch ${batchNum}`);
				print(`No. of keys set: ${result.length}`);

				// Resume the stream for further data flow
				print(`Resuming stream`);
				x.resume();
				paused = false;

				// Refresh the line counter to default
				lineCount = 0;
			}
		})
		.on('resume', () => {
			paused = false;
		})
		.on('end', async function() {
			// All lines are read, file is closed now.
			print(`\nInserting batch number : ${batchNum}`);
			let result = await cache.set(context);
			print(`Result of batch ${batchNum}`);
			print(`No. of keys set: ${result.length}`);
			print(`\nStream ended\nTotal Lines processed: ${totalLines}\n`);

			if (settings.logTime) {
				console.timeEnd('Processing_time');
			}
		});
};

module.exports = script;
