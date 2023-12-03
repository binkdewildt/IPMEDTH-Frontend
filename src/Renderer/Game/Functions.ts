import {Simulate} from "react-dom/test-utils";
import loadedData = Simulate.loadedData;

export default function MazeGeneration(ctx:any, mazeCanvas: any) {
    let difficulty = 10
    let cellSize = mazeCanvas.mazeCanvas.width / difficulty;
    let maze;
    let draw;
    let player;
    let sprite: HTMLImageElement;
    let finishSprite: HTMLImageElement;

    function rand(max:number) {
        return Math.floor(Math.random() * max);
    }

    function shuffle(a:any) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function Maze(this: any, Width:number, Height:number) {
        let mazeMap: any[];
        let width = Width;
        let height = Height;
        let startCoord: { x: number; y: number; }, endCoord: { x: number; y: number; };
        let dirs = ["n", "s", "e", "w"];
        let modDir = {
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

        this.map = function() {
            return mazeMap;
        };
        this.startCoord = function() {
            return startCoord;
        };
        this.endCoord = function() {
            return endCoord;
        };

        function genMap() {
            mazeMap = new Array(height);
            for (let y = 0; y < height; y++) {
                mazeMap[y] = new Array(width);
                for (let x = 0; x < width; ++x) {
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
            let isComp = false;
            let move = false;
            let cellsVisited = 1;
            let numLoops = 0;
            let maxLoops = 0;
            let pos = {
                x: 0,
                y: 0
            };
            let numCells = width * height;
            while (!isComp) {
                move = false;
                mazeMap[pos.x][pos.y].visited = true;

                if (numLoops >= maxLoops) {
                    shuffle(dirs);
                    maxLoops = Math.round(rand(height / 8));
                    numLoops = 0;
                }
                numLoops++;
                for (let index = 0; index < dirs.length; index++) {
                    let direction = dirs[index];
                    // @ts-ignore
                    let nx = pos.x + modDir[direction].x;
                    // @ts-ignore
                    let ny = pos.y + modDir[direction].y;

                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        //Check if the tile is already visited
                        if (!mazeMap[nx][ny].visited) {
                            //Carve through walls from this tile to next
                            mazeMap[pos.x][pos.y][direction] = true;
                            // @ts-ignore
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
                    //  If it failed to find a direction,
                    //  move the current position back to the prior cell and Recall the method.
                    pos = mazeMap[pos.x][pos.y].priorPos;
                }
                if (numCells === cellsVisited) {
                    isComp = true;
                }
            }
        }

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

    function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
        var map = Maze.map();
        var cellSize = cellsize;
        var drawEndMethod;
        ctx.lineWidth = cellSize / 40;

        this.redrawMaze = function(size) {
            cellSize = size;
            ctx.lineWidth = cellSize / 50;
            drawMap();
            drawEndMethod();
        };

        function drawCell(xCord, yCord, cell) {
            var x = xCord * cellSize;
            var y = yCord * cellSize;

            if (cell.n === false) {
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

        function drawMap() {
            for (let x = 0; x < map.length; x++) {
                for (let y = 0; y < map[x].length; y++) {
                    drawCell(x, y, map[x][y]);
                }
            }
        }

        function drawEndFlag() {
            let coord = Maze.endCoord();
            let gridSize = 4;
            let fraction = cellSize / gridSize - 2;
            let colorSwap = true;
            for (let y = 0; y < gridSize; y++) {
                if (gridSize % 2 === 0) {
                    colorSwap = !colorSwap;
                }
                for (let x = 0; x < gridSize; x++) {
                    ctx.beginPath();
                    ctx.rect(
                        coord.x * cellSize + x * fraction + 4.5,
                        coord.y * cellSize + y * fraction + 4.5,
                        fraction,
                        fraction
                    );
                    if (colorSwap) {
                        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                    } else {
                        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                    }
                    ctx.fill();
                    colorSwap = !colorSwap;
                }
            }
        }

        function drawEndSprite() {
            let offsetLeft = cellSize / 50;
            let offsetRight = cellSize / 25;
            let coord = Maze.endCoord();
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

        function clear() {
            let canvasSize = cellSize * map.length;
            ctx.clearRect(0, 0, canvasSize, canvasSize);
        }

        if (endSprite != null) {
            drawEndMethod = drawEndSprite;
        } else {
            drawEndMethod = drawEndFlag;
        }
        clear();
        drawMap();
        drawEndMethod();
    }

    function loadSprites(){
        let complete1 = false;
        let complete2 = false;

        sprite = new Image();
        sprite.src =
            "../../Assets/Arrows/arrow_down.png"
        sprite.setAttribute("crossOrigin", " ");
        sprite.onload = function() {
            complete1 = true;
            console.log("complete1: ",complete1);
        };

        finishSprite = new Image();
        finishSprite.src = "../../Assets/Arrows/arrow_up.png"
        finishSprite.setAttribute("crossOrigin", " ");
        finishSprite.onload = function() {
            // finishSprite = changeBrightness(1.1, finishSprite);
            complete2 = true;
            console.log(complete2);
        };
        return complete1 && complete2;
    }

    function makeMaze() {
        // let ctx = ctx;
        let spritesLoaded = loadSprites()
        console.log(spritesLoaded);
        // while(!spritesLoaded){
        //     spritesLoaded = loadSprites()
        // }
        // if(loadSprites()){
        //     // @ts-ignore
        //     maze = new Maze(difficulty, difficulty);
        //     // @ts-ignore
        //     draw = new DrawMaze(maze, ctx, cellSize);
        //     // player = new Player(maze, mazeCanvas, cellSize, sprite);
        // }

    }

    return makeMaze()
}


