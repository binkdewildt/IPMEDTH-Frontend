import MazeGenerator from "./MazeGenerator";
import { Coordinate, Direction } from "./MazeModels";

export default class Player {
    public coord: Coordinate;
    public element: HTMLElement | null;
    private movingTimeout: NodeJS.Timeout | null = null;


    constructor(coord: Coordinate) {
        this.coord = coord;
        this.element = document.getElementById("player");
        this.setPlayerPosition(coord);
    }


    //#region Positions
    public setPlayerPosition(coord: Coordinate | null = null) {
        // Don't move when the moveMaze is set to true
        if (!MazeGenerator.moveMaze && this.element !== null) {
            let pos: Coordinate = this.getPositionPixels(coord ?? this.coord);
            this.element.style.left = pos.x + "px";
            this.element.style.top = pos.y + "px";
        }
    }

    private getPositionPixels(coord: Coordinate): Coordinate {
        return {
            x: coord.x * (MazeGenerator.cellSize ?? 0),
            y: coord.y * (MazeGenerator.cellSize ?? 0)
        }
    }
    //#endregion

    //#region Moving
    public move(dir: Direction, coord: Coordinate) {
        if (this.element === null) return;

        // Update the playerPos --> just to be sure
        this.coord = coord;

        let className: string = this.getClassDirection(dir);

        // Adjust the element
        this.element.className = "";
        this.element.classList.add(className);
        this.setPlayerPosition(coord);

        // Check if the timeout is still running
        if (this.movingTimeout !== null) {
            clearInterval(this.movingTimeout);
            this.movingTimeout = null;
        }

        // Remove the class for the moving
        this.movingTimeout = setTimeout(() => {
            if (this.element !== null)
                this.element.className = "";

            this.movingTimeout = null;
        }, MazeGenerator.animationDuration * 1000);
    }

    private getClassDirection(dir: Direction): string {
        switch (dir) {
            case Direction.up:
                return "movingUp";
            case Direction.right:
                return "movingRight"
            case Direction.down:
                return "movingDown"
            case Direction.left:
                return "movingLeft"
        }
    }
    //#endregion
}