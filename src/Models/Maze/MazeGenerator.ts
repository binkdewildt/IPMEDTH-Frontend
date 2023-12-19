import Maze from "./Maze";
import { Coordinate, Direction, MazeCell, MoveResult, Sprite } from "./MazeModels";
import { Size } from "../Size";


// Sprite imports
import playerImg from "../../Assets/piet.webp";
import playerWithLightImg from "../../Assets/pietWithLight.webp";
import finishImg from "../../Assets/schoenTransparant.webp";


export default class MazeGenerator {
    public points: number = 0;
    public level: number = 1;

    private cellSize: number = 0;      // Wordt gezet vlak voor het tekenen
    public static clipSize: number = 0;      // Wordt gezet vlak voor het tekenen

    public maze: Maze | null = null;

    private container: HTMLElement = null!;
    private canvas: HTMLCanvasElement = null!;
    private ctx: CanvasRenderingContext2D = null!;


    //#region Settings
    public static darkOverlay: boolean = true;
    public static moveMaze: boolean = true;
    //#endregion


    //#region Sprites
    private playerSprite: HTMLImageElement = null!;
    private finishSprite: HTMLImageElement = null!;
    //#endregion


    //#region State updaters
    public setPoints: ((newPoints: number) => void) | null = null;
    public setLevel: ((newLevel: number) => void) | null = null;
    //#endregion


    constructor() {
        this.loadSprites();
    }

    public setCanvas(canvas: HTMLCanvasElement): void {
        // Set the correct size
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        this.ctx = canvas.getContext("2d")!;
        this.canvas = canvas;
        this.container = canvas.parentElement!;
    }


    //#region Moving
    public move(dir: Direction): void {
        if (this.maze === null)
            return;


        let oldCoords: Coordinate = { ...this.maze.player.coord };
        let result: MoveResult = this.maze.move(dir);
        let newCoords: Coordinate = { ...this.maze.player.coord };

        // Clear the previous cell
        if (result.clearPreviousCell) {
            this.removeSprite(oldCoords);
        }

        // Clear the cell on the next coords
        if (result.clearNextCell) {
            this.removeSprite(newCoords);
        }

        // Move the player
        if (result.canMove) {
            this.removeSprite(oldCoords);
            this.drawSprite(this.playerSprite, this.maze.player.coord);
            this.drawDarkOverlay(this.maze);
            this.positionMaze(this.maze);
        }

        // If the player got points
        if (result.gotPoints !== null) {
            let newPoints = this.points + result.gotPoints;
            this.setPoints && this.setPoints(newPoints)
            this.points = newPoints;
        }

        // Check if finished
        if (result.finished) {
            let newLevel = this.level + 1;
            this.setLevel && this.setLevel(newLevel);
            this.level = newLevel;
            this.Generate();
        }
    }
    //#endregion


    //#region Generating
    public Generate(): void {
        let difficulty: number = this.getDifficulty();
        var maze = new Maze(difficulty, difficulty);
        this.drawMaze(maze);
        this.maze = maze;
    }
    //#endregion


    //#region Drawing maze
    private initDrawing(maze: Maze) {
        this.cellSize = this.canvas.width / maze.map.length;
        MazeGenerator.clipSize = this.cellSize;            // Moet de radius zijn, dus halve cell + klein randje voor de volgende stap
        this.ctx.lineWidth = this.cellSize / 15;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) // Clear the whole canvas beforehand
    }


    private drawMaze(maze: Maze): void {
        this.initDrawing(maze);

        // Draw the dark overlay
        // must be before the drawing of the maze
        this.drawDarkOverlay(maze);

        this.positionMaze(maze);

        // Draw the map
        for (let x: number = 0; x < maze.map.length; x++) {
            for (let y: number = 0; y < maze.map[x].length; y++) {
                let coord: Coordinate = { x: x, y: y };
                this.drawCell(coord, maze.map[x][y]);
            }
        }

        // Draw the presents
        maze.sprites.forEach((s: Sprite, i: number) => {
            s.image.onload = (ev: Event) => {
                this.drawSprite(s.image, s.coord);
            }
            // this.drawSprite(s.image, s.coord)
        })


        // Draw the start & end
        this.playerSprite.onload = () => this.drawSprite(this.playerSprite, maze.player.coord);
        this.drawSprite(this.playerSprite, maze.player.coord);
        this.finishSprite.onload = () => this.drawSprite(this.finishSprite, maze.end);
        this.drawSprite(this.finishSprite, maze.end);
    }


    private drawCell(coord: Coordinate, cell: MazeCell) {
        let x: number = coord.x * this.cellSize;
        let y: number = coord.y * this.cellSize;

        if (!cell.n) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + this.cellSize, y);
            this.ctx.stroke();
        }
        if (!cell.s) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + this.cellSize);
            this.ctx.lineTo(x + this.cellSize, y + this.cellSize);
            this.ctx.stroke();
        }
        if (!cell.e) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + this.cellSize, y);
            this.ctx.lineTo(x + this.cellSize, y + this.cellSize);
            this.ctx.stroke();
        }
        if (!cell.w) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + this.cellSize);
            this.ctx.stroke();
        }
    }
    //#endregion


    //#region Dark overlay
    private drawDarkOverlay(maze: Maze): void {
        if (!MazeGenerator.darkOverlay) return;      // Do nothing when the setting is turned off
        this.container.classList.add("darkOverlay")

        let coords: Coordinate = maze.player.coord;
        let x: number = (this.cellSize * coords.x) + (this.cellSize / 2);
        let y: number = (this.cellSize * coords.y) + (this.cellSize / 2);

        let path: string = `circle(${MazeGenerator.clipSize}px at ${x}px ${y}px)`;
        this.canvas.style.clipPath = path;
    }
    //#endregion


    //#region Moving maze
    private positionMaze(maze: Maze): void {
        if (!MazeGenerator.moveMaze) return;        // Do nothing when the setting is turned off

        let coords: Coordinate = maze.player.coord;
        let x: number = (this.canvas.width / 2) - (this.cellSize / 2) - (coords.x * this.cellSize);
        let y: number = (this.canvas.height / 2) - (this.cellSize / 2) - (coords.y * this.cellSize);

        this.canvas.style.position = "absolute";
        this.canvas.style.left = `${x}px`
        this.canvas.style.top = `${y}px`
    }
    //#endregion


    //#region Drawing sprites
    private drawSprite(asset: HTMLImageElement, coord: Coordinate): void {
        let offset: number = (this.cellSize - this.ctx.lineWidth) / 100;         // Ook de lineWidth meenemen in de berekening
        let maxSize: number = this.cellSize - (2 * offset);
        let size = this.resizeWithAspectRatio(asset.width, asset.height, maxSize, maxSize);

        let x: number = (coord.x * this.cellSize) + (this.cellSize / 2) - size.width / 2
        let y: number = (coord.y * this.cellSize) + (this.cellSize / 2) - size.height / 2

        this.ctx.drawImage(
            asset,
            x,
            y,
            size.width,
            size.height,
        )
    }

    private resizeWithAspectRatio(srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number): Size {
        var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

        return { width: srcWidth * ratio, height: srcHeight * ratio, ratio: ratio };
    }

    // Legen van een cell - de linewidth, anders wordt een deel van
    // de border weggehaald
    private removeSprite(coord: Coordinate): void {
        this.ctx.clearRect(
            coord.x * this.cellSize + this.ctx.lineWidth,
            coord.y * this.cellSize + this.ctx.lineWidth,
            this.cellSize - (this.ctx.lineWidth * 2),
            this.cellSize - (this.ctx.lineWidth * 2),
        );
    }
    //#endregion


    //#region Sprites
    private loadSprites(): void {
        //CHARACTER PIET 
        this.playerSprite = new Image();
        this.playerSprite.src = MazeGenerator.darkOverlay ? playerWithLightImg : playerImg;
        this.playerSprite.setAttribute("crossOrigin", " ");

        //SHOE 
        this.finishSprite = new Image();
        this.finishSprite.src = finishImg;
        this.finishSprite.setAttribute("crossOrigin", " ");
    }
    //#endregion


    //#region Difficulty
    private getDifficulty(): number {
        switch (this.level) {
            case 1:
                return 5;
            case 2:
                return 5;
            case 3:
                return 6;
            case 4:
                return 6;
            case 5:
                return 7;
            default:
                return 5;
        }
    }
    //#endregion
}