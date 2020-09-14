module.exports = function() {
  Room.prototype.findAvailableSource = function(creep) {
    const source = creep.pos.findClosestByPath(FIND_SOURCES);
    console.log(creep)
    return source;
  }
};
