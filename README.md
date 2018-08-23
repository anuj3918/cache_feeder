# cache_feeder
This node package reads key-value pairs from a CSV file and inserts it into Redis using streams.

## Application
Use this package if you want to set key-value pairs from a CSV file which contains huge number of rows (N_rows > 100,000).
The script makes use of streams and a csv parser to read the file and make requests to cache in batches to reduce round trip time.

## Why ?
At the start of a project or even in an ongoing project, sometimes it is required to insert a lot of key-value pairs into cache for the program to work properly. Inserting these (> 1 million) keys into cache by loading it into memory at once is not a good option and mostly results in app crashes. The better way to approach this problem is through streams.

## Supported cache
1. Redis
2. Aerospike (In progress)

## Installation
```
npm install --save cache_feeder
```

## Github repository
https://github.com/anuj3918/cache_feeder.git

## Code example
```
//  Setup options for library and cache
const options = {
	cacheConfig: {
		type: 'redis',
		host: '127.0.0.1',
		port: 6379
	},
	libSettings: {
		commandsPerBatch: 40,
		logTime: true,
		logProcesses: true,
		keyColName: 'key',
		valueColName: 'value'
	}
};

//  Requires cache_feeder and initialise it, cf here is a Promise object
const cf = require('./index')(options);

//  Starts setting key value pairs to cache, can use async-await here as well
cf('./MOCK_DATA.csv')
	.then(result => {
		console.log(result);
	});
```

## Details of 'options' to be passed
Below are the default values of options with details
```
const options = {
	cacheConfig: {
		type: 'redis', // Type of cache
		host: '127.0.0.1',  //  Host of cache
		port: 6379  //  Port of cache
	},
	libSettings: {
		commandsPerBatch: 40, // Number of set commands to send in one batch request
		logTime: true,  //  Logs the total time taken on terminal
		logProcesses: true, //  Logs the tasks performed on terminal
		keyColName: 'key',  //  Name of column header to be set as key name
		valueColName: 'value' //  Name of column header to be set as value name
	}
};
```

## Sample CSV file
```
first_name,email
anuj,anuj3918@gmail.com
gupta,anuj.gupta@bookmyshow.com
```
## To do
1. Support for Aerospike.
2. Adding more flexibility while creating connections to cache.
3. Log any failures while inserting.
4. Retry for only the failures keys encountered previously.
5. Load testing metrics to be added in Readme.md
6. Pausing and resuming stream while reconnecting to cache.
7. Basic test cases using Chai/mocha/jest.


## Contributions
You can add any of the above features into this package and create a pull request.
For any further queries, write to anuj3918@gmail.com
