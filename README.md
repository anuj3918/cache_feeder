# cache_feeder
This node application reads key-value pairs from a CSV file and inserts it into Redis using streams.

## Application
Use this application if you want to set key-value pairs from a CSV file which contains huge number of rows (N_rows > 100,000).
The script makes use of streams and a csv parser to read the file and make requests to cache in batches to reduce round trip time.

## Supported cache
1. Redis
2. Aerospike (In progress)

## Usage example
```
//  Requires 
const feeder = require('cache_feeder');

//  Setup options for library and cache
const options = {
	type: 'redis',
	cacheConfig: {
		host: '127.0.0.1',
		port: 6379
	},
	libSettings: {
		commandsPerBatch: 40,
		logTime: true,
		logProcesses: true,
		path: './csv/sample.csv',
		keyColName: 'key',
		valueColName: 'value'
	}
};

//  Starts setting key value pairs to cache
feeder(options)
```

## Explaining options
Below are the default values of options
```
const options = {
	type: 'redis', // Type of cache
	cacheConfig: {
		host: '127.0.0.1',  //  Host of cache
		port: 6379  //  Port of cache
	},
	libSettings: {
		commandsPerBatch: 40, // Number of set commands to send in one batch request
		logTime: true,  //  Logs the total time taken on terminal
		logProcesses: true, //  Logs the tasks performed on terminal
		path: './csv/sample.csv', //  Relative path to a csv file
		keyColName: 'key',  //  Name of column header to be set as key name
		valueColName: 'value' //  Name of column header to be set as value name
	}
};
```

## Sample csv file
```
first_name,email
anuj,anuj3918@gmail.com
gupta,anuj.gupta@bookmyshow.com
```
