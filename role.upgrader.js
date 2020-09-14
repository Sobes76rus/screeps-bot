var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.upgrading && !creep.store.getUsedCapacity()) {
            creep.memory.upgrading = false;
        }
        
        if (!creep.memory.upgrading && !creep.store.getFreeCapacity()) {
            creep.memory.upgrading = true;
        }
        
	    if (!creep.memory.upgrading) {
            var sources = creep.room.find(FIND_SOURCES);
            const source = creep.pos.findClosestByPath(sources);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } 
        
        else {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;