import Maze from "./Maze";
import { Coordinate, Direction, MazeCell, MoveResult, Sprite } from "./MazeModels";
import { Size } from "../Size";


// Sprite imports
import finishImg from "../../Assets/schoenTransparant.webp";
import { sleep } from "../../Extensions/TimeExtensions";


export default class MazeGenerator {
    public points: number = 0;
    public level: number = 1;

    public static animationDuration: number = 0;
    public static cellSize: number = 1;      // Wordt gezet vlak voor het tekenen
    public static clipSize: number = 1;      // Wordt gezet vlak voor het tekenen

    public maze: Maze | null = null;

    private container: HTMLElement = null!;
    private player: HTMLElement | null = null;
    private canvas: HTMLCanvasElement = null!;
    private ctx: CanvasRenderingContext2D = null!;


    //#region Settings
    public static darkOverlay: boolean = true;
    public static moveMaze: boolean = false;
    //#endregion


    //#region Sprites
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
        this.player = this.container.querySelector("#player");

        // Getting the transition-duration from the css --> this way the durations are always in sync
        if (this.player !== null) {
            let playerStyle: CSSStyleDeclaration = getComputedStyle(this.player);
            let transitionDuration: string = playerStyle.getPropertyValue("transition-duration");
            MazeGenerator.animationDuration = parseFloat(transitionDuration);
        }
    }


    //#region Moving
    public move(dir: Direction): void {
        if (this.maze === null)
            return;


        let oldCoords: Coordinate = { ...this.maze.player.coord };
        let result: MoveResult | null = this.maze.move(dir);
        let newCoords: Coordinate = { ...this.maze.player.coord };

        if (result === null) return;

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
            this.maze.player.move(dir, newCoords)
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
            this.handleEnding();
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
        MazeGenerator.cellSize = this.canvas.width / maze.map.length;
        MazeGenerator.clipSize = MazeGenerator.cellSize;
        this.ctx.lineWidth = MazeGenerator.cellSize / 15;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) // Clear the whole canvas beforehand

        // Set the player to the correct starting position
        maze.player.setPlayerPosition();

        // Resize the player and set the correct position
        if (this.player !== null) {
            this.player.style.width = MazeGenerator.cellSize + "px";
            this.player.style.height = MazeGenerator.cellSize + "px";

            // Het opvagen van de speler bij het starten van een nieuw level
            // Hoeft alleen maar een delay the hebben wanneer de darkOverlay aangezet is
            setTimeout(() => {
                if (this.player !== null)
                    this.player.style.opacity = "1";
            }, MazeGenerator.darkOverlay ? MazeGenerator.animationDuration * 1000 : 0)
        }
    }


    private drawMaze(maze: Maze): void {
        this.initDrawing(maze);

        // Move the dark overlay to the correct position first
        this.drawDarkOverlay(maze, null, 0);

        // Draw the dark overlay in the correct size
        if (MazeGenerator.darkOverlay) {
            setTimeout(() => this.drawDarkOverlay(maze), MazeGenerator.animationDuration * 1000);
        }

        // Set the maze to the correct position
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
        })


        // Draw the start & end
        this.finishSprite.onload = () => this.drawSprite(this.finishSprite, maze.end);
        this.drawSprite(this.finishSprite, maze.end);
    }


    private drawCell(coord: Coordinate, cell: MazeCell) {
        let x: number = coord.x * MazeGenerator.cellSize;
        let y: number = coord.y * MazeGenerator.cellSize;
        let correction: number = this.ctx.lineWidth / 2;

        if (!cell.n) {
            this.ctx.beginPath();
            this.ctx.moveTo(x - correction, y);
            this.ctx.lineTo(x + MazeGenerator.cellSize + correction, y);
            this.ctx.stroke();
        }
        if (!cell.s) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + MazeGenerator.cellSize);
            this.ctx.lineTo(x + MazeGenerator.cellSize, y + MazeGenerator.cellSize);
            this.ctx.stroke();
        }
        if (!cell.e) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + MazeGenerator.cellSize, y);
            this.ctx.lineTo(x + MazeGenerator.cellSize, y + MazeGenerator.cellSize);
            this.ctx.stroke();
        }
        if (!cell.w) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + MazeGenerator.cellSize);
            this.ctx.stroke();
        }
    }
    //#endregion


    //#region Dark overlay
    private drawDarkOverlay(maze: Maze, coords: Coordinate | null = null, size: number | null = null): void {
        if (!MazeGenerator.darkOverlay) return;      // Do nothing when the setting is turned off
        this.container.classList.add("darkOverlay")

        let c: Coordinate = coords ?? maze.player.coord;
        let x: number = (MazeGenerator.cellSize * c.x) + (MazeGenerator.cellSize / 2);
        let y: number = (MazeGenerator.cellSize * c.y) + (MazeGenerator.cellSize / 2);

        let path: string = `circle(${size ?? MazeGenerator.clipSize}px at ${x}px ${y}px)`;
        this.canvas.style.clipPath = path;
    }
    //#endregion


    //#region Moving maze
    private positionMaze(maze: Maze): void {
        if (!MazeGenerator.moveMaze) return;        // Do nothing when the setting is turned off

        let coords: Coordinate = maze.player.coord;
        let x: number = (this.canvas.width / 2) - (MazeGenerator.cellSize / 2) - (coords.x * MazeGenerator.cellSize);
        let y: number = (this.canvas.height / 2) - (MazeGenerator.cellSize / 2) - (coords.y * MazeGenerator.cellSize);

        this.canvas.style.position = "absolute";
        this.canvas.style.left = `${x}px`
        this.canvas.style.top = `${y}px`

        // Set the absolute center to the player
        if (this.player !== null) {
            this.player.style.left = `calc(50% - ${MazeGenerator.cellSize / 2}px)`;
            this.player.style.top = `calc(50% - ${MazeGenerator.cellSize / 2}px)`;
        }
    }
    //#endregion


    //#region Drawing sprites
    private drawSprite(asset: HTMLImageElement, coord: Coordinate): void {
        let offset: number = (MazeGenerator.cellSize - this.ctx.lineWidth) / 100;         // Ook de lineWidth meenemen in de berekening
        let maxSize: number = MazeGenerator.cellSize - (2 * offset);
        let size = this.resizeWithAspectRatio(asset.width, asset.height, maxSize, maxSize);

        let x: number = (coord.x * MazeGenerator.cellSize) + (MazeGenerator.cellSize / 2) - size.width / 2
        let y: number = (coord.y * MazeGenerator.cellSize) + (MazeGenerator.cellSize / 2) - size.height / 2

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
            coord.x * MazeGenerator.cellSize + this.ctx.lineWidth,
            coord.y * MazeGenerator.cellSize + this.ctx.lineWidth,
            MazeGenerator.cellSize - (this.ctx.lineWidth * 2),
            MazeGenerator.cellSize - (this.ctx.lineWidth * 2),
        );
    }
    //#endregion


    //#region Ending animation
    private handleEnding(): void {

        if (this.maze !== null && MazeGenerator.darkOverlay) {

            // Disable the moving
            this.maze.disableMoving = true;

            setTimeout(async () => {
                // Resize the dark overlay to width 0
                this.maze && this.drawDarkOverlay(this.maze, this.maze.player.coord, 0);    // Resize the dark overlay to 0
                if (this.player !== null) this.player.style.opacity = "0";                  // Fade out the player

                // Updaten van het level nadat een animatie is voltooid
                await sleep(MazeGenerator.animationDuration * 1000 * 1.1);
                this.updateLevel();
                this.Generate();

            }, MazeGenerator.animationDuration * 1000 * 1.5)

        } else {
            this.updateLevel();
            this.Generate();
        }
    }
    //#endregion


    //#region Sprites
    private loadSprites(): void {
        //SHOE 
        this.finishSprite = new Image();
        this.finishSprite.src = finishImg;
        this.finishSprite.setAttribute("crossOrigin", " ");
    }
    //#endregion


    //#region Level
    private updateLevel(): void {
        let newLevel = this.level + 1;
        this.setLevel && this.setLevel(newLevel);
        this.level = newLevel;
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