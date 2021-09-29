// We create a player that swings a sword at randomly spawned enemies
// This is both practical (in the sense that it's a game) and
// makes it so that the memory actually fills up over time

// We have to make it ascii tho (graphical APIs are doomed) and also the input has to be automatic

// We also want to make it as simple as possible (though still including the concept of objects, since without those a garbage collector would be pointless)

// All that I realize now is that garbage collectors generally come in to play (and talk about their performance) is more relevant when you have a program that is constantly running

function spawnPlayer(x, y) {
  return {
    x: 0,
    y: 0,
    r: 5,
  };
}

// Types of enemies:

// normal
// does nothing lol

function spawnNormalEnemy(x, y) {
  return {
    x: 0,
    y: 0,
    r: 5,
    type: 'normal'
  };
}

// mother
// spawns children every 2nd tick

function spawnMotherEnemy(x, y) {
  return {
    x: 0,
    y: 0,
    r: 5,
    type: 'mother'
  };
}

// ally
// damage is split between allies

// do NOT call this function directly ty
function spawnAlliedEnemy(x, y) {
  return {
    x: 0,
    y: 0,
    r: 5,
    type: 'allied',
    allies: []
  };
}

const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`${used} MB used`);
