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

function spawnNothing() {
  return {
    type: "none",
  };
}

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

function tick(board) {
  // create available points
  let points = [];
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      // by checking none
      if (board[y][x].type == "none") {
        points.push([y, x]);
      }
    }
  }

  // generate one enemy of a random type
  let point = points[Math.floor(rand() * (points.length - 1))];
  board[point[0]][point[1]] = spawnNormalEnemy();

  // player kills one enemy (every other tick)

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      // do nothing
      if (board[y][x].type == "normal") {
      } else if (board[y][x].type == "mother") {
        // spawn children
        let child1 = spawnChild(board[y][x]);
        let child2 = spawnChild(board[y][x]);
        board[y].push(child1);
        board[y].push(child2);
      } else if (board[y].type == "allied") {
        // do something
        let team = spawnAlliedEnemies(3);
        for (let i = 0; i < 3; i++) {
          while (new_counter != 3) {
            board[y][x] = team[new_counter];
          }
        }
      } else if (board[y].type == "player") {
      }
    }
  }
}

function render(board) {
  // Just draws the board
  for (let y = 0; y < board.length; y++) {
    let string = "";
    for (let x = 0; x < board[0].length; x++) {
      let symbol = ".";
      if (board[y][x].type == "normal") {
        symbol = "n";
      } else if (board[y][x].type == "mother") {
        symbol = "m";
      } else if (board[y][x].type == "child") {
        symbol = "c";
      } else if (board[y][x].type == "allied") {
        symbol = "a";
      } else if (board[y][x].type == "player") {
        symbol = "p";
      }
      string += symbol;
    }
    console.log(string);
  }

  console.log("--------------------------------");
}

function nothing() {}

let state = 0.1234;
function rand() {
  state = Math.sin(state) * 10000;
  return state - Math.floor(state);
}

function run(board) {
  tick(board);
  render(board);
  setTimeout(run, 1000, board);

  console.log(`${process.memoryUsage().heapUsed / 1024 / 1024} MB used`);
}

function main() {
  // Create board
  let board = [];
  for (let y = 0; y < 12; y++) {
    let temp = [];
    for (let x = 0; x < 100; x++) {
      // Fill it with 'nothing'
      temp.push(spawnNothing());
    }
    board.push(temp);
  }
  // Spawn our player
  let player = spawnPlayer();
  board[6][6] = player;
  // Intiate game loop
  run(board);
}

main();
