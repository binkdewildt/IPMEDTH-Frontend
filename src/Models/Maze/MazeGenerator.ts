export default class MazeGeneration(ctx: any, mazeCanvas: any, level: any, updateLevel: any) {
    let difficulty: number;
    switch (level) {
        case 1:
            difficulty = 5;
            break;
        case 2:
            difficulty = 6;
            break;
        case 3:
            difficulty = 7;
            break;
        case 4:
            difficulty = 8;
            break;
        case 5:
            difficulty = 9;
            break;
        default:
            difficulty = 10;
            break;
    }


    // console.log(mazeCanvas.width, mazeCanvas.height)
    let cellSize = mazeCanvas.height / difficulty;
    let maze: null | undefined;
    let draw: null | undefined;
    let player: any;
    let sprite: HTMLImageElement;
    let finishSprite: HTMLImageElement;
    let buttons = document.querySelectorAll('button');

    function rand(max: number) {
        return Math.floor(Math.random() * max);
    }

    function shuffle(a: any) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function Maze(this: any, Width: number, Height: number) {
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

        this.mapGen = function () {
            return mazeMap;
        };
        this.startCoord = function () {
            return startCoord;
        };
        this.endCoord = function () {
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

    function DrawMaze(this: any, Maze: any, ctx: any, cellsize: any, endSprite = null) {
        let map = Maze.mapGen();
        // let draw = this
        // let drawEndMethod: () => void;
        ctx.lineWidth = cellSize / 40;


        this.redrawMaze = function (size: number) {
            cellSize = size;
            ctx.lineWidth = cellSize / 40;
            drawMap();
            drawEndFlag();
        };

        function drawCell(xCord: number, yCord: number, cell: { n: boolean; s: boolean; e: boolean; w: boolean; }) {
            let x = xCord * cellSize;
            let y = yCord * cellSize;

            if (!cell.n) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + cellSize, y);
                ctx.stroke();
            }
            if (!cell.s) {
                ctx.beginPath();
                ctx.moveTo(x, y + cellSize);
                ctx.lineTo(x + cellSize, y + cellSize);
                ctx.stroke();
            }
            if (!cell.e) {
                ctx.beginPath();
                ctx.moveTo(x + cellSize, y);
                ctx.lineTo(x + cellSize, y + cellSize);
                ctx.stroke();
            }
            if (!cell.w) {
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

        // function drawEndSprite() {
        //     let offsetLeft = cellSize / 50;
        //     let offsetRight = cellSize / 25;
        //     let coord = Maze.endCoord();
        //     ctx.drawImage(
        //         endSprite,
        //         2,
        //         2,
        //         //@ts-ignore
        //         endSprite.width,
        //         //@ts-ignore
        //         endSprite.height,
        //         coord.x * cellSize + offsetLeft,
        //         coord.y * cellSize + offsetLeft,
        //         cellSize - offsetRight,
        //         cellSize - offsetRight
        //     );
        // }

        function clear() {
            let canvasSize = cellSize * map.length;
            ctx.clearRect(0, 0, canvasSize, canvasSize);
        }

        clear();
        drawEndFlag();
        drawMap();
    }

    function Player(this: any, maze: any, ctx: any, _cellsize: any, sprite = null, draw: any) {
        // let ctx = c.getContext("2d");
        let drawSprite: (coord: { x: number; y: number; }) => void;
        drawSprite = drawSpriteCircle;
        // if (sprite != null) {
        //     drawSprite = drawSpriteImg;
        // }
        let player = this;
        let map = maze.mapGen();
        let cellCoords = {
            x: maze.startCoord().x,
            y: maze.startCoord().y
        };
        let cellSize = _cellsize;
        let halfCellSize = cellSize / 2;

        this.redrawPlayer = function (_cellsize: any) {
            cellSize = _cellsize;
            // drawSpriteImg(cellCoords);
        };

        function drawSpriteCircle(coord: { x: number; y: number; }) {
            ctx.beginPath();
            ctx.fillStyle = "red";
            ctx.arc(
                (coord.x + 1) * cellSize - halfCellSize,
                (coord.y + 1) * cellSize - halfCellSize,
                halfCellSize - 2,
                0,
                2 * Math.PI
            );
            ctx.fill();
            ctx.closePath();

            if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
                // level += 1
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                // player = undefined;
                updateLevel(level += 1);
                player.unbindKeyDown();
            }

        }

        // function drawSpriteImg(coord: { x: any; y: any; }) {
        //     let offsetLeft = cellSize / 50;
        //     let offsetRight = cellSize / 25;
        //     ctx.drawImage(
        //         sprite,
        //         0,
        //         0,
        //         // @ts-ignore
        //         sprite.width,
        //         // @ts-ignore
        //         sprite.height,
        //         coord.x * cellSize + offsetLeft,
        //         coord.y * cellSize + offsetLeft,
        //         cellSize - offsetRight,
        //         cellSize - offsetRight
        //     );
        //     if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
        //         onComplete(moves);
        //         player.unbindKeyDown();
        //     }
        // }

        function removeSprite(coord: { x: any; y: any; }) {
            let offsetLeft = cellSize / 50;
            let offsetRight = cellSize / 20;
            ctx.clearRect(
                coord.x * cellSize + offsetLeft,
                coord.y * cellSize + offsetLeft,
                cellSize - offsetRight,
                cellSize - offsetRight
            );


        }

        function move(dir: string) {
            let cell = map[cellCoords.x][cellCoords.y];
            switch(dir){
                case "Up":
                    if (cell.n) {
                        removeSprite(cellCoords);
                        cellCoords = {
                            x: cellCoords.x,
                            y: cellCoords.y - 1
                        };
                        // @ts-ignore
                        new DrawMaze(maze, ctx, cellSize, finishSprite);
                        drawSprite(cellCoords);
                    }
                    break;
                case "Down":
                    if (cell.s) {
                        removeSprite(cellCoords);
                        cellCoords = {
                            x: cellCoords.x,
                            y: cellCoords.y + 1
                        };
                        // @ts-ignore
                        new DrawMaze(maze, ctx, cellSize, finishSprite);
                        drawSprite(cellCoords);
                    }
                    break;
                case "Left":
                    if (cell.w) {
                        removeSprite(cellCoords);
                        cellCoords = {
                            x: cellCoords.x - 1,
                            y: cellCoords.y
                        };
                        // @ts-ignore
                        new DrawMaze(maze, ctx, cellSize, finishSprite);
                        drawSprite(cellCoords);
                    }
                    break;
                case"Right":
                    if (cell.e) {
                        removeSprite(cellCoords);
                        cellCoords = {
                            x: cellCoords.x + 1,
                            y: cellCoords.y
                        };
                        // @ts-ignore
                        new DrawMaze(maze, ctx, cellSize, finishSprite);
                        drawSprite(cellCoords);
                    }
                    break;
            }

        }

        function checkClick(e: any) {
            // console.log("click: ", e.target.className.includes("button"))
            const dirs = ["Up", "Down", "Left", "Right"]
            dirs.forEach((dir) => {
                if (e.target.className.includes(dir)) {
                    move(dir);
                }
            })
        }

        this.bindKeyDown = function () {
            if (buttons) {
                buttons.forEach((button) => {
                    button.addEventListener("click", checkClick, false);
                })
            }
            // console.log("up", up)
        };

        this.unbindKeyDown = function () {
            if (buttons) {
                buttons.forEach((button) => {
                    button.removeEventListener("click", checkClick, false);
                })
            }
        };

        drawSprite(maze.startCoord());

        this.bindKeyDown();
    }

    // function loadSprites() {
    //     let complete1 = false;
    //     let complete2 = false;
    //
    //     sprite = new Image();
    //     sprite.src =
    //         "../../Assets/Arrows/arrow_down.png"
    //     sprite.setAttribute("crossOrigin", " ");
    //     sprite.onload = function () {
    //         complete1 = true;
    //         // console.log("complete1: ", complete1);
    //     };
    //
    //     finishSprite = new Image();
    //     finishSprite.src = "../../Assets/Arrows/arrow_up.png"
    //     finishSprite.setAttribute("crossOrigin", " ");
    //     finishSprite.onload = function () {
    //         // finishSprite = changeBrightness(1.1, finishSprite);
    //         complete2 = true;
    //         // console.log("complete2", complete2);
    //     };
    //     return complete1 && complete2;
    // }

    function makeMaze() {
        if (player !== undefined) {
            player.unbindKeyDown();
            player = null;
        }
        // let ctx = ctx;
        // let spritesLoaded = loadSprites()
        // @ts-ignore
        maze = new Maze(difficulty, difficulty);
        // @ts-ignore

        draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
        // @ts-ignore

        player = new Player(maze, ctx, cellSize, sprite, draw);

    }

    return makeMaze()
}


