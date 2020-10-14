// Reurn a floored random number between 0 and max value sent
function rand(max) {
    return Math.floor(Math.random() * max);
}

// Shuffles an array "a" sent 
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
  
//  Toggles status of element between "hidden" and "visible" based on id sent
function toggleVisablity(id) {
    if (document.getElementById(id).style.visibility == "visible") {
      document.getElementById(id).style.visibility = "hidden";
    } else {
      document.getElementById(id).style.visibility = "visible";
    }
  }

//  Edit victory message with "moves" sent and call toggleVisability() on div containing it
  function displayVictoryMess(moves) {
    document.getElementById("moves").innerHTML = "You Moved " + moves + " Steps.";
    toggleVisablity("Message-Container");  
  }
  
  function Maze(Width, Height) {
    // Array of cell coords forming the maze
    var mazeMap;

    // Maze start and end coords
    // Start and end coords will always be opposite edges  
    var startCoord, endCoord;

    // Dimensions of maze
    var width = Width;
    var height = Height;

    // Vars necessary for movement
    var dirs = ["n", "s", "e", "w"];
    var modDir = {
      n: {
        y: -1,
        x: 0,
        o: "s"
      },
      s: {
        y: 1,
        x: 0,
        o: "n"
      },
      e: {
        y: 0,
        x: 1,
        o: "w"
      },
      w: {
        y: 0,
        x: -1,
        o: "e"
      }
    };
  
    // Return object attributes functions
    this.map = function() {
      return mazeMap;
    };
    this.startCoord = function() {
      return startCoord;
    };
    this.endCoord = function() {
      return endCoord;
    };
  
    // Generate map function
    // Map = 2 dimensional array containing "cell" objects with properties
    // 1st level = rows (height)
    // 2nd level = every cell on X axis for every row 
    function genMap() {
      // 1st level build
      mazeMap = new Array(height);

      // 2nd level build
      for (y = 0; y < height; y++) {
        mazeMap[y] = new Array(width);
        for (x = 0; x < width; ++x) {
          // Cell properties setup
          mazeMap[y][x] = {
            n: false,
            s: false,
            e: false,
            w: false,
            visited: false,
            priorPos: null
          };
        }
      }
    }
  
    function defineMaze() {
      var isComp = false;
      var move = false;
      var cellsVisited = 1;
      var numLoops = 0;
      var maxLoops = 0;
      var pos = {
        x: 0,
        y: 0
      };
      var numCells = width * height;

    //   Map drawing loop
    // a) Shuffles 4 possible directions in array. <--- "Order of trying"
    // b) move from current pos towards random direction if possible (hasn't been visited yet)
    // c) If can't move (already visited), try another random direction
    // d) If all neighbours visited, backtrack to previous cell and restart at a)
      while (!isComp) {
        move = false;
        mazeMap[pos.x][pos.y].visited = true;

        if (numLoops >= maxLoops) {
         // Shuffle array of 4 directions
          shuffle(dirs);
          maxLoops = Math.round(rand(height / 8));
          numLoops = 0;
        }
        numLoops++;
        for (index = 0; index < dirs.length; index++) {
          var direction = dirs[index];
          var nx = pos.x + modDir[direction].x;
          var ny = pos.y + modDir[direction].y;
  
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            //Check if the tile is already visited
            if (!mazeMap[nx][ny].visited) {
              //Carve through walls from this tile to next
              mazeMap[pos.x][pos.y][direction] = true;
              mazeMap[nx][ny][modDir[direction].o] = true;
  
              //Set Currentcell as next cells Prior visited
              mazeMap[nx][ny].priorPos = pos;
              //Update Cell position to newly visited location
              pos = {
                x: nx,
                y: ny
              };
              cellsVisited++;
              //Recursively call this method on the next tile
              move = true;
              break;
            }
          }
        }
  
        if (!move) {
          // If no available neighbour, backtrack to previous cell and recall the method
          pos = mazeMap[pos.x][pos.y].priorPos;
        }

        // If maze is complete, changes var stopping while loop
        if (numCells == cellsVisited) {
          isComp = true;
        }
      }
    }
  
    // Define start and end coords randomly among 4 possible cases
    function defineStartEnd() {
      switch (rand(4)) {
        case 0:
          startCoord = {
            x: 0,
            y: 0
          };
          endCoord = {
            x: height - 1,
            y: width - 1
          };
          break;
        case 1:
          startCoord = {
            x: 0,
            y: width - 1
          };
          endCoord = {
            x: height - 1,
            y: 0
          };
          break;
        case 2:
          startCoord = {
            x: height - 1,
            y: 0
          };
          endCoord = {
            x: 0,
            y: width - 1
          };
          break;
        case 3:
          startCoord = {
            x: height - 1,
            y: width - 1
          };
          endCoord = {
            x: 0,
            y: 0
          };
          break;
      }
    }
  
    genMap();
    defineStartEnd();
    defineMaze();
  }
  
//   Collection of drawing functions 
  function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
    var map = Maze.map();
    var cellSize = cellsize;
    ctx.lineWidth = cellSize / 40;
  
    this.redrawMaze = function(size) {
      cellSize = size;
      ctx.lineWidth = cellSize / 50;
      drawMap();
    };
    
    // Call drawCell() for every cell
    function drawMap() {
      for (x = 0; x < map.length; x++) {
        for (y = 0; y < map[x].length; y++) {
          drawCell(x, y, map[x][y]);
        }
      }
    }

    // Draw the cell's 4 walls
    function drawCell(xCord, yCord, cell) {
            var x = xCord * cellSize;
            var y = yCord * cellSize;
        
            if (cell.n == false) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x + cellSize, y);
              ctx.stroke();
            }
            if (cell.s === false) {
              ctx.beginPath();
              ctx.moveTo(x, y + cellSize);
              ctx.lineTo(x + cellSize, y + cellSize);
              ctx.stroke();
            }
            if (cell.e === false) {
              ctx.beginPath();
              ctx.moveTo(x + cellSize, y);
              ctx.lineTo(x + cellSize, y + cellSize);
              ctx.stroke();
            }
            if (cell.w === false) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x, y + cellSize);
              ctx.stroke();
            }
    }
  
    function drawEndSprite() {
      var offsetLeft = cellSize / 50;
      var offsetRight = cellSize / 25;
      var coord = Maze.endCoord();
      ctx.drawImage(
        endSprite,
        2,
        2,
        endSprite.width,
        endSprite.height,
        coord.x * cellSize + offsetLeft,
        coord.y * cellSize + offsetLeft,
        cellSize - offsetRight,
        cellSize - offsetRight
      );
    }
  
    // Clears the whole canvas
    function clear() {
      var canvasSize = cellSize * map.length;
      ctx.clearRect(0, 0, canvasSize, canvasSize);
    }
    
    // Calling methods to initiate drawing
    clear();
    drawMap();
    drawEndSprite();
  }
  
//  -----------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                         Player Object
//  -----------------------------------------------------------------------------------------------------------------------------------------------------
  function Player(maze, c, _cellsize, onComplete, sprite = null) {
    var player = this;
    var moves = 0;
    var cellSize = _cellsize;
    var halfCellSize = cellSize / 2;
    var drawSprite;

    drawSprite = drawSpriteImg;

    // Maze and mapping
    var ctx = c.getContext("2d");
    var map = maze.map();
    var cellCoords = {
      x: maze.startCoord().x,
      y: maze.startCoord().y
    };
  
    // Drawing functions -------------------------------------------------------------------------------------------------------------------------------
    this.redrawPlayer = function(_cellsize) {
      cellSize = _cellsize;
      drawSpriteImg(cellCoords);
    };
  
    function drawSpriteImg(coord) {
      var offsetLeft = cellSize / 50;
      var offsetRight = cellSize / 25;
      ctx.drawImage(
        sprite,
        0,
        0,
        sprite.width,
        sprite.height,
        coord.x * cellSize + offsetLeft,
        coord.y * cellSize + offsetLeft,
        cellSize - offsetRight,
        cellSize - offsetRight
      );
      // Check if player completed maze
      if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
        onComplete(moves);
        player.unbindKeyDown();
      }
    }
  
    function removeSprite(coord) {
      var offsetLeft = cellSize / 50;
      var offsetRight = cellSize / 25;
      ctx.clearRect(
        coord.x * cellSize + offsetLeft,
        coord.y * cellSize + offsetLeft,
        cellSize - offsetRight,
        cellSize - offsetRight
      );
    }
  
    // Checks cell is attempting to move in -------------------------------------------------------------------------------------------------------------------------
    function check(e) {
    // Current cell
      var cell = map[cellCoords.x][cellCoords.y];
    // Moves increment
      moves++;

    // Switch according to direction attempted
      switch (e.keyCode) {
        case 65:
        case 37: // west
          if (cell.w == true) {
            removeSprite(cellCoords);
            cellCoords = {
              x: cellCoords.x - 1,
              y: cellCoords.y
            };
            drawSprite(cellCoords);
          }
          break;
        case 87:
        case 38: // north
          if (cell.n == true) {
            removeSprite(cellCoords);
            cellCoords = {
              x: cellCoords.x,
              y: cellCoords.y - 1
            };
            drawSprite(cellCoords);
          }
          break;
        case 68:
        case 39: // east
          if (cell.e == true) {
            removeSprite(cellCoords);
            cellCoords = {
              x: cellCoords.x + 1,
              y: cellCoords.y
            };
            drawSprite(cellCoords);
          }
          break;
        case 83:
        case 40: // south
          if (cell.s == true) {
            removeSprite(cellCoords);
            cellCoords = {
              x: cellCoords.x,
              y: cellCoords.y + 1
            };
            drawSprite(cellCoords);
          }
          break;
      }
    }
  
    // Movement function for swipe
    this.bindKeyDown = function() {
      window.addEventListener("keydown", check, false);
  
      $("#view").swipe({
        swipe: function(
          event,
          direction,
          distance,
          duration,
          fingerCount,
          fingerData
        ) {
            switch (direction) {
                case "up":
                check({
                    keyCode: 38
                });
                break;
                case "down":
                check({
                    keyCode: 40
                });
                break;
                case "left":
                check({
                    keyCode: 37
                });
                break;
                case "right":
                check({
                    keyCode: 39
                });
                break;
            }
        },
        threshold: 0
      });
    };
  
    this.unbindKeyDown = function() {
      window.removeEventListener("keydown", check, false);
      $("#view").swipe("destroy");
    };
  
    drawSprite(maze.startCoord());
  
    this.bindKeyDown();
  }

//   End of player object ---------------------------------------------------------------------------------------------------------------------------------------------------

//   Maze & Sprite drawing functions ---------------------------------------------------------------------------------------------------------------------------------------------------

  var mazeCanvas = document.getElementById("mazeCanvas");
  var ctx = mazeCanvas.getContext("2d");
  var sprite;
  var finishSprite;
  var maze, draw, player;
  var cellSize;
  var difficulty;
  
  // Set canvas size according to viewport size
  window.onload = function() {
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    if (viewHeight < viewWidth) {
      ctx.canvas.width = viewHeight - viewHeight / 100;
      ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
      ctx.canvas.width = viewWidth - viewWidth / 100;
      ctx.canvas.height = viewWidth - viewWidth / 100;
    }

    var isComplete = () => {
      console.log("Runs");
           setTimeout(function(){
             makeMaze();
           }, 500);  
    };

    // Player sprite
    sprite = new Image();
    sprite.src = "images/player.png";
  
    // Finish cell sprite
    finishSprite = new Image();
    finishSprite.src = "images/end.png";
  };
  
  // Redraw maze if window is resized
  window.onresize = function() {
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    if (viewHeight < viewWidth) {
      ctx.canvas.width = viewHeight - viewHeight / 100;
      ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
      ctx.canvas.width = viewWidth - viewWidth / 100;
      ctx.canvas.height = viewWidth - viewWidth / 100;
    }
    cellSize = mazeCanvas.width / difficulty;
    if (player != null) {
      draw.redrawMaze(cellSize);
      player.redrawPlayer(cellSize);
    }
  };
  
  function makeMaze() {
    document.getElementById("mazeCanvas").classList.add("border");
    if (player != undefined) {
      player.unbindKeyDown();
      player = null;
    }

// Change to higher number for smaller cells (ie more paths in maze)
    difficulty = 10;
    cellSize = mazeCanvas.width / difficulty;

    // Initiate maze
    maze = new Maze(difficulty, difficulty);
    draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
    player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);

    // Makes the maze appear
    if (document.getElementById("mazeContainer").style.opacity < "100") {
      document.getElementById("mazeContainer").style.opacity = "100";
    }
}