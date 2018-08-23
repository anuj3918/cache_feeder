const expect = require('chai').expect;
const context = require('../lib/context');

const options = {
	cacheConfig: {
		type: 'redis',
		host: '127.0.0.1',
		port: 6379,
		db: 1
	},
	libSettings: {
		commandsPerBatch: 40,
		logTime: true,
		logProcesses: true,
		keyColName: 'first_name',
		valueColName: 'email'
	}
};

const cf = require('../index')(options);
const ctx = context.get();
const { cache } = ctx;

//Start describing your tests from here on
describe('- Testing feeder with sample csv file', () => {
	before(function(done) {
		cache.connect();
		cache.flush();
		cf('./MOCK_DATA.csv').then(res => {
			done();
		});
	});

	it('Check number of keys in db', function(done) {
		cache.connect();
		cache.size(data => {
			expect(25).to.be.equal(data);
			done();
		});
	});
});
