
/* Private */

var UpdateEntityHelper = require('./update_entity_helper')

// Notify processors of changes in an entity.
function commit(entity) {
	
	/* Check for each processor if it is interested in this entity */
	
	for(var i; i < this._processors.length; i++) {
		var processor = this._processors[i];
		
		var includesBitMask = processor.signature.includesBitMask;
		var excludesBitMask = processor.signature.excludesBitMask;
		var typesBitMask = this._typesBitMasks[entity];
		
		var testInclusion = (includesBitMask & typesBitMask) == includesBitMask || includesBitMask == 0;
		var testExclusion = (excludesBitMask & typesBitMask) == 0 || excludesBitMask == 0;
		
		var processorsBitMask = this._processorsBitMasks[entity];
		var contains = (processor.bit & processorsBitMask) == processor.bit;
		
		if(testInclusion && testExclusion) {
			// IF entity is NOT already in list, add
			if(!contains) {
				processorsBitMask |= processor.bit;
				processor.addEntity(entity);
			}
		} else {
			// IF entity IS already in processor, remove
			if(contains) {
				processorsBitMask &= ~processor.bit;
				processor.removeEntity(entity);
			}
		}
	}
}

function generateSignatureBitMasks(signature) {
	for(var i = 0; i < signature.includeComponentTypes.length; i++) {
		var type = signature.includeComponentTypes[i];
		
		if(this._componentTypes[type] === undefined) {
			this.addComponentType(type);
		}
		
		var componentType = this._componentTypes[type];
		signature.includesBitMask |= componentType.bit;
	}
	
	for(var i = 0; i < signature.excludeComponentTypes.length; i++) {
		var type = signature.excludeComponentTypes[i];
		
		if(this._componentTypes[type] === undefined) {
			this.addComponentType(type);
		}
		
		var componentType = this._componentTypes[type];
		signature.excludesBitMask |= componentType.bit;
	}
}

// Generates a new bit to do bitmask checks on this component type
function generateNextComponentTypeBit() {
	var assignBit = this._nextComponentBit;
	this._nextComponentBit <<= 1;
	return assignBit;
}

// Generate a new unique id for this component type internally
function generateNextComponentTypeId() {
	var assignId = this._nextComponentTypeId;
	this._nextComponentTypeId++;
	return assignId;
}

function generateNextProcessorBit() {
	var assignBit = this._nextProcessorBit;
	this._nextProcessorBit <<= 1;
	return assignBit;
}

/* Public */

module.exports = EntitySystem;
function EntitySystem() {

	/* System */
	this._init = false;

	/* Entity */
	this._highestEntityIndex = 0;
	this._removedEntities = []; // Entities that were created and then destroyed, use them first to create new entities
	this._updateEntityHelper = new UpdateEntityHelper(this);
	
	/* Component type */
	this._nextComponentTypeId = 0;
	this._nextComponentBit = 0;
	this._componentTypes = {}; // map component type (aka constructor) to a component type (object that holds an 'id' and a 'bit')
	
	/* Entity mappers */
	this._components = []; // multidimensional array _components[0][1] is component with component type 0 fo entity 1, identifiers can only be numbers! (V8 performance detects this and makes stuff better)
	this._typesBitMasks = []; // Maps a types bitmask to an entity
	this._systemsBitMasks = []; // Maps a processors bitmask to an entity
	
	/* Processors */
	this._nextProcessorBit = 0;
	this._processors = {} // Maps processor objects by their classname (.constructor)
}

// Create entity
EntitySystem.prototype.createEntity = function() {
	if(this._removedEntities.length > 0) {
		return this._removedEntities.pop();
	}
	return this._highestEntityIndex++;
}

// Delete entity
EntitySystem.prototype.deleteEntity = function(entity) {
	// Release entity components
	this._typesBitMasks[entity] = 0;
	this._systemsBitMasks[entity] = 0;
	
	// Notify processors
	commit();
	
	// Add to removed entities pool
	this._removedEntities.push(entity);
}

// Add componentType
// Should not be necessary to call explicitely. Registering processors with the correct signatures will register components automatically.
EntitySystem.prototype.addComponentType = function(classname) {
	if(this._init === false) {
		if(this._componentTypes[classname] === undefined) {
			var id = generateNextComponentTypeId();
			var bit = generateNextComponentTypeBit();
			var componentType = new ComponentType(id, bit);
			this._componentTypes[classname] = componentType;
		}
	} else {
		console.log('It is fobidden to add component types after the entity system has been initialized.');
	}
	
	return this; // Enable cascading
}

// Add processor
EntitySystem.prototype.addProcessor = function(processor) {
	if(this._init === false) {
		if(this._processors[processor.constructor]) {
			console.log('Processor of type ' + classname + ' already exists.');
			return this;
		}
		if(!processor.super_ !== require('./processor')) {
			console.log('This processor does not extend the Processor custom type.');
			return this;
		}
		
		// Generate component types bitmask
		generateSignatureBitMasks(processor.signature);
		
		// Generate processor bit
		processor.bit = generateNextProcessorBit();
		
		// Add to processors
		this._processors[processor.constructor] = processor;
	} else {
		console.log('It is fobidden to add processors after the entity system has been initialized.');
	}
	
	return this; // Enable cascading
}

// Get processor
EntitySystem.prototype.getProcessor = function(classname) {
	return this._processors[classname];
}

// Get component
EntitySystem.prototype.getComponent = function(entity, componentType) {
	var componentTypeId = this._componentTypes[componentType];
	return this._components[componentTypeId][entity];
}

// Update entity
EntitySystem.prototype.updateEntity = function(entity, callback) {
	this._updateEntityHelper.entity = entity;
	callback(this._updateEntityHelper);
	commit(entity);
}

// After initialize is called processors and componenttypes are sealed of and can't be added to anymore.
EntitySystem.prototype.initialize = function() {
	this._init = true;
}


