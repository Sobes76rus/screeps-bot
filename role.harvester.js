const roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if (creep.store.getFreeCapacity()) {
        var sources = creep.room.find(FIND_SOURCES);
        const source = creep.pos.findClosestByPath(sources)
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      }
        
      else {
        const structures = creep.room.find(FIND_MY_STRUCTURES, { filter: s => (
          (
            s.structureType === STRUCTURE_SPAWN || 
            s.structureType === STRUCTURE_EXTENSION
          ) &&
          s.store.getFreeCapacity()
        )});
        
        const target = creep.pos.findClosestByPath(structures);
        const error = creep.transfer(target);
        if (error === ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }
      }
	}
};

module.exports = roleHarvester;