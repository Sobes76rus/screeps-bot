require('prototype.room')();

const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

Memory.namesCounter = Memory.namesCounter || {};

module.exports.loop = function () {
    const spawn = Game.spawns.Spawn1;
    const room = spawn.room;

    const extensions = room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_EXTENSION });
    const sites = room.find(FIND_MY_CONSTRUCTION_SITES, { filter: s => s.structureType === STRUCTURE_EXTENSION });
    const items = extensions + sites;
    let stop = false;

    for (let s = 2; !stop; s += 2) {
      for (let x = 1; x <= s; x += 1) {
        const y = s - x;
        let dx = x, dy = y;

        for (let i = 0; i < 4 && !stop; i++) {
            const buffer = dx;
            dx = dy;
            dy = -buffer;

            const px = spawn.pos.x + dx;
            const py = spawn.pos.y + dy;

            const error = room.createConstructionSite(px, py, STRUCTURE_EXTENSION)

            if (error === OK) {
              stop = true;
            }

            else if (error === ERR_RCL_NOT_ENOUGH) {
              stop = true;
            }

            else if (error === ERR_INVALID_TARGET) {
              continue;
            }

            else {
              room.visual.text(`Create extensions site ${error}`, px, py);
            }
        }
      }
    }

    /*
    {
      const sources = room.find(FIND_SOURCES);
      const structures = room.find(FIND_STRUCTURES, { filter: s => (
        s.structureType === STRUCTURE_SPAWN || 
        s.structureType === STRUCTURE_EXTENSION || 
        s.structureType === STRUCTURE_CONTROLLER
      )})

      const items = sources;
      _.each(structures, item => items.push(item));      

      console.log(items)
      console.log(typeof items)

      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const itemA = items[i];
          const itemB = items[j];

          const path = PathFinder.search(itemA.pos, { pos: itemB.pos, range: 1 });
          for (let pos of path.path) {
            room.createConstructionSite(pos, STRUCTURE_ROAD)
          }

          console.log(path);
        }
      }
    }
    /**/

    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    for (let name in Game.creeps) {
        const creep = Game.creeps[name];

        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }

        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }

        if (creep.memory.role === 'builder') {
          roleBuilder.run(creep);
        }
    }

    const harvestersCount = _.sum(Game.creeps, (creep) => creep.memory.role == 'harvester');
    const upgradersCount = _.sum(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    const numberOfBuilders = _.sum(Game.creeps, (creep) => creep.memory.role == 'builder');

    if (harvestersCount < 2) {
        const index = (Memory.namesCounter.harvester || 0) + 1;
        const name = `harvester-${index}`;
        const error = spawn.spawnCreep([WORK, CARRY, MOVE], name, { memory: { 'role': 'harvester' } });

        if (error == ERR_NAME_EXISTS) {
            Memory.namesCounter['harvester'] = index;
        }

        if (error == OK) {
            Memory.namesCounter['harvester'] = index;
        }
    }

    else if (upgradersCount < 1) {
        const index = (Memory.namesCounter.upgrader || 0) + 1;
        const name = `upgrader-${index}`;
        const error = spawn.spawnCreep([WORK, CARRY, MOVE], name, { memory: { role: 'upgrader', state: 'harvesting' } });

        if (error == ERR_NAME_EXISTS) {
            Memory.namesCounter['upgrader'] = index;
        }

        if (error == OK) {
            Memory.namesCounter['upgrader'] = index;
        }
    }

    else if (numberOfBuilders < 5) {
        const index = (Memory.namesCounter.builder || 0) + 1;
        const name = `builder-${index}`;
        const error = spawn.spawnCreep([WORK, CARRY, MOVE], name, { memory: { role: 'builder', state: 'harvesting' } });

        console.log(error)

        if (error == ERR_NAME_EXISTS) {
            Memory.namesCounter['builder'] = index;
        }

        if (error == OK) {
            Memory.namesCounter['builder'] = index;
        }
    }
}
