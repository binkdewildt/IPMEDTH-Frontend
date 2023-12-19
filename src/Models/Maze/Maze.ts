import { random } from "../../Extensions/NumberExtensions";
import { Coordinate, Direction, MazeCell, MazeMap, ModifiedDirections, MoveResult, Sprite, SpriteType } from "./MazeModels";
import { shuffle } from "../../Extensions/ArrayExtensions";
import Player from "./Player";

// Sprite
import present1 from "../../Assets/Cadeaus/cadeau.png"
import present2 from "../../Assets/Cadeaus/cadeau2.png"
import present3 from "../../Assets/Cadeaus/cadeau.webp"
import light from "../../Assets/light.png";


// Sounds
import errorSound from "../../Assets/sounds/error.mp3"
import walkSound from "../../Assets/sounds/footsteps.mp3"
import walkSound2 from "../../Assets/sounds/footsteps_2.mp3"
import pickupSound from "../../Assets/sounds/pickup.mp3"
import finishSound from "../../Assets/sounds/finish.mp3"
import MazeGenerator from "./MazeGenerator";


export default class Maze {
    public readonly width: number
    public readonly height: number;

    public map: MazeMap = null!;    // Wordt gezet in constructor --> generate --> genMap
    public readonly sprites: Sprite[] = [];

    public start: Coordinate = null!;
    public end: Coordinate = null!;

    public readonly player: Player = null!;


    //#region Points
    private readonly pointsPerPresent = 100;
    private readonly pointsPerLevel = 10;
    //#endregion


    //#region Private constants
    private readonly directions: string[] = ["n", "e", "s", "w"]
    private readonly modDir: ModifiedDirections = {
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
    //#endregion


    // Constructor
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.generate();
        this.generateSprites();
        this.player = new Player(this.start);
    }


    //#region Moving
    public move(direction: Direction): MoveResult {
        let pointsToAdd: number = 0;
        let canMove: boolean = false;

        let player: Player = this.player;

        let oldCoord: Coordinate = player.coord;
        let newCoord: Coordinate = player.coord;

        let cell: MazeCell = this.map[oldCoord.x][oldCoord.y];

        let clearNextCell: boolean = false;
        let clearPreviousCell: boolean = false;

        switch (direction) {
            case Direction.up:
                if (cell.n) {
                    canMove = true;
                    newCoord.y -= 1;
                }
                break;

            case Direction.right:
                if (cell.e) {
                    canMove = true;
                    newCoord.x += 1;
                }
                break;

            case Direction.down:
                if (cell.s) {
                    canMove = true;
                    newCoord.y += 1;
                }
                break;

            case Direction.left:
                if (cell.w) {
                    canMove = true;
                    newCoord.x -= 1;
                }
                break;
        }

        // Change the position of the player if possible
        if (canMove) {

            // Check if the player stepped on an Sprite
            let sprite: Sprite | null = this.checkSprite(newCoord);
            if (sprite !== null) {
                if (sprite.type === SpriteType.points) {
                    pointsToAdd += this.pointsPerPresent;
                }
                this.handleSprite(sprite);
                clearNextCell = true;
            }

            // Update the player pos
            this.player.coord = newCoord;
        }

        let sound = canMove ? this.getRandomWalkingSound() : errorSound;
        this.playSound(sound);

        let finished: boolean = this.checkEnd(newCoord);
        if (finished) {
            this.playSound(finishSound);
            pointsToAdd += this.pointsPerLevel;
        }

        return {
            clearNextCell: clearNextCell,
            clearPreviousCell: clearPreviousCell,
            canMove: canMove,
            finished: finished,
            gotPoints: pointsToAdd === 0 ? null : pointsToAdd,
            redrawOverlay: true
        } as MoveResult;
    }
    //#endregion


    //#region Generation
    // Handles the complete generation of the maze
    private generate(): void {
        this.genMap();
        this.defineStartEnd();
        this.defineMaze();
    }


    // Fill the array with default cells
    private genMap(): MazeMap {
        var map = new Array<MazeCell[]>(this.height);
        for (let y = 0; y < this.height; y++) {
            map[y] = new Array<MazeCell>(this.width);
            for (let x = 0; x < this.width; ++x) {
                map[y][x] = {
                    n: false,
                    s: false,
                    e: false,
                    w: false,
                    visited: false,
                    priorPos: null
                };
            }
        }

        this.map = map;
        return map;
    }

    // Loop over the maze to generate the paths etc.
    private defineMaze(): void {
        var map: MazeMap = this.map ?? this.genMap();     // Creates a copy of the map

        let isCompleted: boolean = false;
        let move: boolean = false;

        let numCells: number = this.width * this.height;
        let maxLoops: number = 0;
        let numLoops: number = 0;
        let cellsVisited: number = 0;

        let pos: Coordinate | null = { x: 0, y: 0 }

        while (!isCompleted) {
            move = false;

            if (pos === null) break;

            map[pos.x][pos.y].visited = true;

            if (numLoops >= maxLoops) {
                shuffle(this.directions);
                maxLoops = Math.round(random(this.height / 8));
                numLoops = 0;
            }

            for (let index = 0; index < this.directions.length; index++) {
                let direction: string = this.directions[index];
                let modDirKey: keyof ModifiedDirections = direction as keyof ModifiedDirections;
                let cellKey: keyof MazeCell = direction as keyof MazeCell;

                let newX: number = pos.x + this.modDir[modDirKey].x;
                let newY: number = pos.y + this.modDir[modDirKey].y;

                // Check if the new Coordinates are valid (within the width and height)
                if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height) {

                    // Check if the tile is already visited
                    if (!map[newX][newY].visited) {

                        // Carve trough walls from this tile to next
                        (map[pos.x][pos.y][cellKey] as Boolean) = true;
                        (map[newX][newY][this.modDir[modDirKey].o as keyof MazeCell] as Boolean) = true;

                        // Set CurrentCell as next cells PriorVisited
                        map[newX][newY].priorPos = pos;

                        // Update the CellPosition to newly visited location
                        pos = { x: newX, y: newY };
                        cellsVisited++;

                        // Recursively call this method on the next tile
                        move = true;
                        break;
                    }
                }
            } //: FOR-loop

            if (!move) {
                //  If it failed to find a direction,
                //  move the current position back to the prior cell and Recall the method.
                pos = map[pos.x][pos.y].priorPos
            }

            // If all the cells are set
            if (numCells === cellsVisited) {
                isCompleted = true;
            }
        }

        // Update the global map
        // this.map = map;
    }
    //#endregion


    //#region Start/End
    private defineStartEnd(): void {
        switch (random(4)) {
            case 0:
                this.start = {
                    x: 0,
                    y: 0
                };
                this.end = {
                    x: this.height - 1,
                    y: this.width - 1
                };
                break;
            case 1:
                this.start = {
                    x: 0,
                    y: this.width - 1
                };
                this.end = {
                    x: this.height - 1,
                    y: 0
                };
                break;
            case 2:
                this.start = {
                    x: this.height - 1,
                    y: 0
                };
                this.end = {
                    x: 0,
                    y: this.width - 1
                };
                break;
            case 3:
                this.start = {
                    x: this.height - 1,
                    y: this.width - 1
                };
                this.end = {
                    x: 0,
                    y: 0
                };
                break;
        }
    }

    private checkEnd(coord: Coordinate): boolean {
        return coord.x === this.end.x && coord.y === this.end.y;
    }
    //#endregion


    //#region Sprites
    private generateSingleSprite(asset: string, type: SpriteType, usedCoords: Coordinate[]): Sprite {
        var s = new Image();
        s.src = asset;

        // genereren van unieke coordinaten
        let coord: Coordinate = this.generateRandomCoord();
        while (this.checkCoordinateInArray(usedCoords, coord))
            coord = this.generateRandomCoord();

        var p: Sprite = { image: s, coord: coord, type: type }
        this.sprites.push(p);
        usedCoords.push(coord);
        return p;
    }

    private generateSprites(): void {
        let usedCoords: Coordinate[] = [this.start, this.end]

        // Generate a powerup if needed
        if (MazeGenerator.darkOverlay)
            this.generateSingleSprite(light, SpriteType.lightPowerUp, usedCoords)


        // Generate the presents
        let amountOfPresents: number = this.getAmountPresents(this.width);
        for (var i: number = 0; i < amountOfPresents; i++) {
            this.generateSingleSprite(this.getRandomPresentImg(), SpriteType.points, usedCoords)
        }
    }

    private getRandomPresentImg(): string {
        let p = [present1, present2, present3]
        return p[random(p.length)];
    }

    private getAmountPresents(difficulty: number): number {
        switch (difficulty) {
            case 5:
                return 2;
            case 6:
                return 3;
            case 7:
                return 4;
            default:
                return 2;
        }
    }

    // Checkt of de speler op een cadeau staat
    private checkSprite(coord: Coordinate): Sprite | null {
        let index: number = this.sprites.findIndex(p => p.coord.x === coord.x && p.coord.y === coord.y);
        let found: boolean = index !== -1;

        // If the present exists
        if (found)
            return this.sprites.splice(index, 1)[0];

        return null;
    }


    private handleSprite(s: Sprite): void {
        let sound: string | null = null;

        switch (s.type) {
            case SpriteType.points:
                sound = pickupSound;
                break;

            case SpriteType.lightPowerUp:
                MazeGenerator.clipSize *= 2;
                break;
        }

        if (sound !== null)
            this.playSound(sound);
    }
    //#endregion


    //#region Sound
    private getRandomWalkingSound(): string {
        let s = [walkSound, walkSound2]
        return s[random(s.length)];
    }

    private playSound(sound: string): void {
        var audio = new Audio(sound);
        audio.play();
    }
    //#endregion


    //#region Coordinates
    private generateRandomCoord(): Coordinate {
        return { x: random(this.width), y: random(this.height) };
    }

    private checkCoordinateInArray(array: Coordinate[], obj: Coordinate): boolean {
        return array.filter(o => o.x === obj.x && o.y === obj.y).length !== 0;
    }
    //#endregion

}