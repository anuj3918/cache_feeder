var mongoOperations = require("../db/mongo_operations");
var redisOperations = require("../db/redis_operations");
var globals = require('../lib/globals');
var constants = require('../core/decision_engine/constants');
var expect = require("chai").expect;
var request = require("request");

module.exports = {
    clearSummaryAndHistory: clearSummaryAndHistory,
    clearSwitcherResults: clearSwitcherResults,
	setAllMappings: setAllMappings,
    checkApi: checkApi,
    setupsInDB: setupsInDB
};

function clearSummaryAndHistory(grouping, group){
    before(function(done) {
        mongoOperations.deleteMany("Summary", {'feeder.grouping' : grouping}, function(result){
            console.log("   - Cleaned summary collection for banks");
        });
        mongoOperations.deleteMany("DecisionHistory", {'grouping' : grouping}, function(result){
            console.log("   - Cleaned decision history collection for banks");
        });
        if(grouping === "BANKS"){
            mongoOperations.update("GroupGatewayMapping", {group: group}, {"allow_notification" : true, "auto_switch": true, "allow_inactive": true}, {}, function(result){
                console.log("   - Turned on allow_notification and auto_switch feature for group : "+group);
            });
        }
        else {
            mongoOperations.update("GroupGatewayMapping", {group: group}, {"allow_notification" : true, "auto_switch": true}, {}, function(result){
                console.log("   - Turned on allow_notification and auto_switch feature for group : "+group);
            });
        }
        
        done();
    });

    it('No summary object for group : '+group, function(done) {
        setTimeout(function(){
            mongoOperations.read("Summary", {group: group}, {}, function(result){
                expect(result.length).to.be.equal(0);
                done();
            });
        }, 40);
    });

    it('No Decision_History objects for group : '+group, function(done) {
        setTimeout(function(){
            mongoOperations.read("DecisionHistory", {group: group}, {}, function(result){
                expect(result.length).to.be.equal(0);
                done();
            });
        }, 40);
    });
}

function clearSwitcherResults(){
    before(function(done) {
        mongoOperations.deleteMany("SwitcherResults", {}, function(result){
            console.log("   - Cleaned switcher results collection");
            done();
        });
    });

    it('No documents in SwitcherResults', function(done) {
        setTimeout(function(){
            mongoOperations.read("SwitcherResults", {}, {}, function(result){
                expect(result.length).to.be.equal(0);
                done();
            });
        }, 40);
    });   
}

function setAllMappings(){
	describe('a) Empty mongo collections', function() {
        it('Cleaned Lookup collection', function(done) {
        	mongoOperations.deleteMany("BankGatewayMapping", {}, function(result){
	  			done();
	  		});
        });
        it('Cleaned group_gateway collection', function(done) {
        	mongoOperations.deleteMany("GroupGatewayMapping", {}, function(result){
	  			done();
	  		});
        });
    });

    describe('b) Insert mongo mappings', function() {
        it('Inserted Lookup collection', function(done) {
        	mongoOperations.insertMany("BankGatewayMapping", require("./data_databases/lookup.json"), function(result){
        		expect(result).to.not.equal(false);
        		done();
        	});
        });
        it('Inserted group_gateway collection', function(done) {
        	mongoOperations.insertMany("GroupGatewayMapping", require("./data_databases/group_gateway.json"), function(result){
        		expect(result).to.not.equal(false);
        		done();
	  		});
        });
    });

    describe('c) Insert redis mappings', function() {
        it('Inserted OnusSettings hashset', function(done) {
        	redisOperations.setHashSetMapper("OnusSettings", require("./data_databases/onus_settings.json"),  function(err, result){
	  			expect(result).to.not.equal(false);
        		done();
	  		});
        });
    });

    describe('d) Read mongo mappings', function() {
        it('Lookup should have 73 documents', function(done) {
        	mongoOperations.read("BankGatewayMapping", {}, {}, function(result){
        		expect(result.length).to.be.equal(73);
        		done();
        	});
        });
        it('Group_gateway should have 88 documents', function(done) {
        	mongoOperations.read("GroupGatewayMapping", {}, {}, function(result){
        		expect(result.length).to.be.equal(88);
        		done();
        	});
        });
    });
}

function checkApi(){
    it('Check API should work', function(done) {
        var options = {
            url: 'http://localhost:9000/check',
            method: 'GET'
        };
        request(options, function (error, response, body) {
            expect(response.statusCode).to.be.equal(200);
            done();
        });
    });
}

function setupsInDB(){
    it('We should have 3 rules', function(done) {
        mongoOperations.read("Rule", {}, {}, function(result){
            expect(result.length).to.be.equal(3);
            done();
        });
    });
    it('We should have 3 events for Cards', function(done) {
        mongoOperations.read("Event", {grouping: "CATEGORIES"}, {}, function(result){
            expect(result.length).to.be.equal(3);
            done();
        });
    });
    it('We should have 3 events for Banks', function(done) {
        mongoOperations.read("Event", {grouping: "BANKS"}, {}, function(result){
            expect(result.length).to.be.equal(3);
            done();
        });
    });
    // it('We should have 3 events for Gateways', function(done) {
    //     mongoOperations.read("Event", {grouping: "GATEWAYS"}, {}, function(result){
    //         console.log(result)
    //         expect(result.length).to.be.equal(3);
    //         done();
    //     });
    // });
}