var assert = require('chai').assert;

var EntitySystem = require('../lib/entity_system');
var es = new EntitySystem();

// Do tests

// Guidelines on structure: http://stackoverflow.com/questions/19298118/what-is-the-role-of-describe-in-mocha
describe('EntitySystem', function() {
	describe('#createEntity', function() {
		it('increases returned value by 1 every iteration');
	});
	
	describe('#updateEntity', function() {
		it('First test', function() {
			assert.equal(0, 1, 'Actual tests are yet to be constructed.');
		});
	});
});