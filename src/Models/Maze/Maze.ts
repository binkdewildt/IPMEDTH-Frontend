import { Direction } from "readline";
import { random } from "../../Extensions/NumberExtensions";
import { Coordinate, Direction, MazeCell, MazeMap } from "./MazeModels";

export default class Maze {

    public width: number
    public height: number;

    public map: MazeMap | undefined = undefined;

    public start: Coordinate = null!;
    public end: Coordinate = null!;

    // Constructor
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.generate();
    }


    //#region Generation
    // Handles the complete generation of the maze
    private generate(): void {
        this.genMap();
        this.defineStartEnd();
    }


    // Fill the array with default cells
    private genMap(): void {
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
    }

    // Loop over the maze to generate the paths etc.
    private defineMaze(): void {
        let directions: Direction[] = [Direction.north, Direction.]
        let isCompleted: boolean = false;
        let move: false;


        let numCells: number = this.width * this.height;

        while (!isCompleted) {
            
        }
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
    //#endregion


}