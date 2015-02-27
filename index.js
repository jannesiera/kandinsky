// Index exposes the global interface of Kadinsky. It is a singleton to expose the classes (custom types, singletons) in the directory.

var EntitySystem = require('./lib/entity_system');
var Processor = require('./lib/processor');

module.exports = {
	
	/* Info */
	
	version : '0.0.0',
	
	/* Custom Types */
	
	// usage: var entitySystem = require('kandinsky').EntitySystem();
	EntitySystem : function() {
		return new EntitySystem();
	},
	
	Processor : function(aspect) {
		return new Processor(aspect);
	}
	
	/* Singletons */
}