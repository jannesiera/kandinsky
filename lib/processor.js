
/* Public */

module.exports = Processor;
function Processor(signature) {
	this._entities = [];
	this.signature = signature;
}

// Simple push operation
Processor.prototype.addEntity(entity) {
	this._entities.push(entity);
}

// Iterate over the elements to find the entity and remove it
Processor.prototype.removeEntity(entity) {
	var length = this._entities.length;
	for(var i=0; i < length; i++) {
		if(this._entities[i] === entity) {
			this._entities.splice(i, 1);
			return;
		}
	}
}

Processor.prototype.execute = function(param) {
	var length = this._entities.length;
	for(var i; i < length; i++) {
		this.algorithm(this._entities[i], param);
	}
}

Processor.prototype.algorithm = function(entity, param) {
	console.log('Processor.algorithm should be overwritten by subclasses.');
}