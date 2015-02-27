
/* Public */

module.exports = UpdateEntityHelper;
function UpdateEntityHelper(entitySystem) {
	this.es = entitySystem;
	this.entity = 0; // Current entity to be updated
}

// Add component
UpdateEntityHelper.prototype.addComponent = function(component) {
	var componentType = es._componentTypes[component.constructor];
	
	// Map component to entity
	es._components[componentType.id][entity] = component;
	
	// Add type bit to entity typesBitMap
	es._typesBitMaps[entity] |= componentType.bit; // Bitwise OR
	
	return es; // enable cascading
}

// Remove component
UpdateEntityHelper.prototype.removeComponent = function(componentClass) {
	var componentType = es._componentTypes[componentClass];
	
	// Remove component from map
	es._components[componentType.id][entity] = undefined;
	
	// Substract type bit from entity typesBitMap
	es._typesBitMaps[entity] &= ~componentType.bit; // Bitwise AND on the inverse (NOT)
	
	return es; // enable cascading
}