var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.state === 'building' && !creep.store.getUsedCapacity()) {
          creep.memory.state = 'harvesting';
          creep.memory.sourceId = null;
        }
        
        if (creep.memory.state === 'harvesting' && !creep.store.getFreeCapacity()) {
          creep.memory.state = 'building';
        }
        
	      if (creep.memory.state === 'building') {            
          const source = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
          if (source) {
            const error = creep.build(source)
            if (error === ERR_NOT_IN_RANGE) {
              creep.moveTo(source);
            }
          }
        } 
        
        else {
            if (!creep.memory.sourceId) {
              const source = creep.room.findAvailableSource(creep);
              creep.memory.sourceId = source && source.id;
            }          

            const source = Game.getObjectById(creep.memory.sourceId);
            const error = creep.harvest(source);
            if (error === ERR_NOT_IN_RANGE) {
              creep.moveTo(source);
            }
        }
	}
};

module.exports = roleUpgrader;