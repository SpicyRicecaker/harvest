// We create a player that swings a sword at randomly spawned enemies
// This is both practical (in the sense that it's a game) and
// makes it so that the memory actually fills up over time

// We have to make it ascii tho (graphical APIs are doomed) and also the input has to be automatic

// We also want to make it as simple as possible (though still including the concept of objects, since without those a garbage collector would be pointless)

// All that I realize now is that garbage collectors generally come in to play (and talk about their performance) is more relevant when you have a program that is constantly running

// Need some kind of random number generator that is consistent, meaning it'll run the same way one two machines given the same seed.
// However, the game also needs to be able to push the specs of the computer to a few megabytes. The problem is that we need millions of objects in order to actually fill up the ram capacity, and we can't display all of it
// If we do make it integrate with WGPU, we'll also be testing the GPU capabilities of the machine, which isn't really a concern, tho it would be more practical because we could display the enemy and the player using pixels.

// Why does minecraft lag? It lags because it generates hundreds of thousands of blocks and after a while those chunks get unloaded, it has hundreds of variables for each object (pig, animal, water) and as you walk past them, mine them, etc. they get destroyed

// But for a regular script or a small-scale text game, there really are not that many objects

// Therfore a better program to test a garbage collector would deal with pure numbers so that scaling is easier.

// What kind of pure number programs are there?

function spawnPlayer() {
  return {
    type: "player",
  };
}

// Types of enemies:

// normal
// does nothing lol

function spawnNormalEnemy() {
  return {
    type: "normal",
  };
}

// mother
// spawns children every 2nd tick

function spawnMotherEnemy() {
  return {
    type: "mother",
    children: [],
  };
}

function spawnChild(mother) {
  return {
    type: "child",
    parent: mother,
  };
}

// ally
// damage is split between allies

// do NOT call this function directly ty
function spawnAlliedEnemy() {
  return {
    type: "allied",
    allies: [],
  };
}

function spawnAlliedEnemies(num) {
  let team = [];
  for (let i = 0; i < num; i++) {
    // create enemy
    let enemy = spawnAlliedEnemy(0, 0);
    for (let j = 0; j < team.length; j++) {
      // reference cycle
      team[counter].allies.push(enemy);
      enemy.push(team[counter]);
      counter++;
    }
  }
  return team;
}

function tick(entities) {
  // create occupied squares
  let counter1 = 0;

  // Generate hashmap from list of entities

  let points = [];
  for (let y = 0; y < entities.length; y++) {
    for (let x = 0; x < entities.length; x++) {
      points.push([y, x]);
    }
  }

  while (counter1 != entities.length) {
    totalX.splice(totalX.indexOf(entities[counter1].x), 1);
    totalY.splice(totalY.indexOf(entities[counter1].y), 1);
    counter1++;
  }
  // generate one enemy of a random type
  let x = totalX[Math.floor(rand() * (totalX.length - 1))];
  console.log(Math.floor(rand() * (totalX.length - 1)));
  let y = totalY[Math.floor(rand() * (totalY.length - 1))];
  console.log(Math.floor(rand() * (totalY.length - 1)));
  entities.push(spawnNormalEnemy(x, y));

  // player kills one enemy (every other tick)

  let counter = 0;
  while (counter != entities.length) {
    // do nothing
    if (entities[counter].type == "normal") {
    } else if (entities[counter].type == "mother") {
      // spawn children
      let child1 = spawnChild(entities[counter]);
      let child2 = spawnChild(entities[counter]);
      entities[counter].push(child1);
      entities[counter].push(child2);
    } else if (entities[counter].type == "allied") {
      // do something
      let team = spawnAlliedEnemies(3);
      let new_counter = 0;
      while (new_counter != 3) {
        entities.push(team[new_counter]);
      }
    } else if (entities[counter].type == "player") {
    }
    counter++;
  }
}

function render(entities) {
  let counter = 0;
  while (counter < entities.length) {
    let symbol = ".";
    if (entities[counter].type == "normal") {
      symbol = "n";
    } else if (entities[counter].type == "mother") {
      symbol = "m";
    } else if (entities[counter].type == "child") {
      symbol = "c";
    } else if (entities[counter].type == "allied") {
      symbol = "a";
    } else if (entities[counter].type == "player") {
      symbol = "p";
    }
    console.log(entities[counter].x, entities[counter].y);
    board[entities[counter].x][entities[counter].y] = symbol;
    counter++;
  }

  // console.log(board);

  let y2 = 0;
  while (y2 < 12) {
    let x = 0;
    let line = "";
    while (x < 12) {
      line += board[y2][x];
      x++;
    }
    console.log(line);
    y2++;
  }
  console.log("--------------------------------");
}

function nothing() {}

let state = 0.1234;
function rand() {
  state = Math.sin(state) * 10000;
  return state - Math.floor(state);
}

function run(entities) {
  tick(entities);
  render(entities);
  setTimeout(run, 1000, entities);

  console.log(`${process.memoryUsage().heapUsed / 1024 / 1024} MB used`);
}

function main() {
  // loop every second
  let board = [];

  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 12; x++) {
      board[x][y] = ".";
    }
  }

  let player = spawnPlayer(6, 6);
  entities.push(player);
  run(entities);
}

main();
