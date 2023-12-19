import piet from "../../Assets/piet.webp";
import shoe from "../../Assets/schoen.webp";
import present from "../../Assets/cadeau2.png";
import { Coordinate, Present } from "./MazeModels";

// @ts-ignore
import errorSound from "../../Assets/sounds/error.mp3"
// @ts-ignore
import walkSound from "../../Assets/sounds/footsteps.mp3"
// @ts-ignore
import walkSound2 from "../../Assets/sounds/footsteps_2.mp3"
// @ts-ignore
import finishSound from "../../Assets/sounds/finish.mp3"
// @ts-ignore
import pickupSound from "../../Assets/sounds/pickup.mp3"


export default function MazeGeneration(ctx: any, mazeCanvas: any, level: any, updateLevel: any, containerRef: any) {
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

    //set to false if you want your position really big, set to true if you want the black background
    const relativePositionVisible = true;
    let maze: null | undefined;
    let draw: null | undefined;
    let player: any;
    let playerSprite: HTMLImageElement;
    let finishSprite: HTMLImageElement;
    let presentSprites: Present[] = [];
    let cellSize: number;
    let clipSize: number;
    let buttons = document.querySelectorAll('button');

    setSizeMaze();

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
    
    function setSizeMaze() {
        const magicNumber = 10;
        if (relativePositionVisible) {
            const canvas: HTMLElement = document.getElementById("mazeCanvas") as HTMLElement;
            canvas.style.width = "100%";
            mazeCanvas.border = "none";
            mazeCanvas.width = containerRef.offsetWidth;
            mazeCanvas.height = containerRef.offsetHeight;
            cellSize = mazeCanvas.width / difficulty;
            clipSize = cellSize - magicNumber;
        } else {
            clipSize = containerRef.offsetHeight / 2;
            cellSize = clipSize + magicNumber;
            mazeCanvas.width = cellSize * difficulty;
            mazeCanvas.height = cellSize * difficulty;
        }
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

        generatePresents(this.startCoord(), this.endCoord());

    }

    function DrawMaze(this: any, Maze: any, ctx: any) {
        let map = Maze.mapGen();
        // let draw = this
        // let drawEndMethod: () => void;
        ctx.lineWidth = cellSize / 40;
        
        this.redrawMaze = function (size: number) {
            var end: Coordinate = Maze.endCoord();
            cellSize = size;
            ctx.lineWidth = cellSize / 40;
            drawMap();
            drawSprite(finishSprite, end);
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

        //SHOE SPRITE IMAGE
        finishSprite.onload = function () {
            drawSprite(finishSprite, Maze.endCoord());
        };

        function clear() {
            let canvasSize = cellSize * map.length;
            ctx.clearRect(0, 0, canvasSize, canvasSize);
        }

        var end: Coordinate = Maze.endCoord();
        clear();
        drawSprite(finishSprite, end)
        drawPresents();
        drawMap();
        

    }

    //COORDINATES FOR CHARACTER
    function Player(this: any, maze: any, ctx: any, _cellsize: number, sprite: HTMLImageElement , draw: any) {
        let map = maze.mapGen();
        let cellCoords = {
            x: maze.startCoord().x,
            y: maze.startCoord().y
        };
        let cellSize = _cellsize;
        let halfCellSize = cellSize / 2;

        cropMaze();

        this.redrawPlayer = function (_cellsize: number) {
            cellSize = _cellsize;
            drawSprite(sprite, cellCoords);
        };

        sprite.onload = function () {
            drawSprite(sprite, cellCoords);
        };

        function move(dir: string) {
            let cell = map[cellCoords.x][cellCoords.y];
            let audio;
            if (rand(2) ===0) {
                audio = new Audio(walkSound);
            } else {
                audio = new Audio(walkSound2);
            }
            switch (dir) {
                case "Up":
                    if (cell.n) {
                        removeSprite(cellCoords);
                        cellCoords = {
                            x: cellCoords.x,
                            y: cellCoords.y - 1
                        };
                        checkPresent(cellCoords);
                        // @ts-ignore
                        new DrawMaze(maze, ctx, cellSize, finishSprite);
                        drawSprite(playerSprite, cellCoords);
                        audio.play();
                    } else {        //PLAYER CANT WALK SO ERROR SOUND
                        let audio = new Audio(errorSound);
                        audio.play();
                    }
                    break;
                    case "Down":
                        if (cell.s) {
                            removeSprite(cellCoords);
                            cellCoords = {
                                x: cellCoords.x,
                                y: cellCoords.y + 1
                            };
                            checkPresent(cellCoords);
                            // @ts-ignore
                            new DrawMaze(maze, ctx, cellSize, finishSprite);
                            drawSprite(playerSprite, cellCoords);
                            audio.play();
                        } else {
                            let audio = new Audio(errorSound);
                            audio.play();
                        }
                        break;
                    case "Left":
                        if (cell.w) {
                            removeSprite(cellCoords);
                            cellCoords = {
                                x: cellCoords.x - 1,
                                y: cellCoords.y
                            };
                            checkPresent(cellCoords);
                            // @ts-ignore
                            new DrawMaze(maze, ctx, cellSize, finishSprite);
                            drawSprite(playerSprite, cellCoords);
                            audio.play();
                        } else {
                            let audio = new Audio(errorSound);
                            audio.play();
                        }
                        break;
                    case "Right":
                        if (cell.e) {
                            removeSprite(cellCoords);
                            cellCoords = {
                                x: cellCoords.x + 1,
                                y: cellCoords.y
                            };
                            checkPresent(cellCoords);
                            // @ts-ignore
                            new DrawMaze(maze, ctx, cellSize, finishSprite);
                            drawSprite(playerSprite, cellCoords);
                            audio.play();
                        } else {
                            let audio = new Audio(errorSound);
                            audio.play();
                        }
                        break;
                }

            cropMaze();

            // checkPresent(cellCoords);
            checkEnd(cellCoords, maze.endCoord())
        }
        
        function cropMaze() {
            const container: HTMLElement = document.getElementsByClassName("mazeContainer")[0] as HTMLElement;
            const canvas: HTMLElement = document.getElementById("mazeCanvas") as HTMLElement;
            let clipLeft: number;
            let clipTop: number;
            if (relativePositionVisible) {
                clipLeft = 0.99 * cellSize * cellCoords.x + halfCellSize;
                clipTop = 0.99 * cellSize * cellCoords.y + halfCellSize;
            } else {
                canvas.style.top = `${halfCellSize - cellCoords.y * cellSize}px`;
                canvas.style.left = `${canvas.offsetWidth / 2 - halfCellSize  - cellCoords.x * cellSize}px`;
                clipTop = clipSize;
                clipLeft = canvas.offsetWidth / 2;
            }
            container.style.clipPath = `circle(${clipSize}px at ${clipLeft}px ${clipTop}px)`;
        }
        
        //CHECK DIRECTION
        function checkClick(e: any) {
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
        };

        this.unbindKeyDown = function () {
            if (buttons) {
                buttons.forEach((button) => {
                    button.removeEventListener("click", checkClick, false);
                })
            }
        };

        drawSprite(sprite, maze.startCoord());
        this.bindKeyDown();
    }


    //MAKING THE SPRITES
    function loadSprites() {
        //CHARACTER PIET 
        playerSprite = new Image();
        playerSprite.src = piet;
        playerSprite.setAttribute("crossOrigin", " ");

        //SHOE 
        finishSprite = new Image();
        finishSprite.src = shoe;
        finishSprite.setAttribute("crossOrigin", " ");
    }

    function checkCoordinateInArray(array: Coordinate[], obj: Coordinate): boolean {
        return array.filter(o => o.x === obj.x && o.y === obj.y).length !== 0;
    }

    function generateRandomCoord(): Coordinate {
        return { x: rand(difficulty), y: rand(difficulty) };
    }

    function makeMaze() {
        if (player !== undefined) {
            player.unbindKeyDown();
            player = null;
        }

        loadSprites();

        // @ts-ignore
        maze = new Maze(difficulty, difficulty);
        // @ts-ignore

        draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
        // @ts-ignore

        player = new Player(maze, ctx, cellSize, playerSprite, draw);
    }


    // Draw the sprites on the canvas
    function drawSprite(asset: HTMLImageElement, coord: Coordinate) {
        let offsetLeft = cellSize / 50;
        let offsetRight = cellSize / 25;

        ctx.drawImage(
            asset,
            0,
            0,
            asset.width,
            asset.height,
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        )
    }

    function removeSprite(coord: Coordinate) {
        let offsetLeft = cellSize / 50;
        let offsetRight = cellSize / 20;
        ctx.clearRect(
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
    }

    function checkEnd(coord: Coordinate, endCoord: Coordinate) {
        if (coord.x === endCoord.x && coord.y === endCoord.y) {
            let audio = new Audio(finishSound);
            audio.play();
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            updateLevel(level += 1)
            player.unbindKeyDown()
        }
    }


    //#region Presents
    function generatePresents(start: Coordinate, end: Coordinate) {
        //GENERATE PRESENTS
        console.log(start)
        let amount: number = 2;
        for (var i: number = 0; i < amount; i++) {
            var s = new Image();
            s.src = present;
            
            // genereren van unieke coordinaten
            let coord: Coordinate = generateRandomCoord();
            var prevCoords = presentSprites.map(x => x.coord);
            prevCoords.push(start);
            prevCoords.push(end);

            while (checkCoordinateInArray(prevCoords, coord))
                coord = generateRandomCoord();

            var p: Present = { image: s, coord: coord }
            presentSprites.push(p);
        }
    }

    // Checkt of de speler op een cadeau staat
    function checkPresent(coord: Coordinate) {
        var index: number = presentSprites.findIndex(c => c.coord.x === coord.x && c.coord.y === coord.y);
        var found: boolean = index !== -1;

        if (found) {
            // spelen pickupSound
            let audio = new Audio(pickupSound)
            audio.play();
            // Legen van de cell
            removeSprite(coord);
            presentSprites.splice(index, 1);
        }
    }

    function drawPresents(): void {
        presentSprites.forEach((s: Present, i: number) => {
            s.image.onload = (ev: Event) => {
                drawSprite(s.image, s.coord);
            }

            drawSprite(s.image, s.coord)
        })
    }
    //#endregion

    return makeMaze()
}


