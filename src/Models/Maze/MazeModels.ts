export type Coordinate = {
    x: number,
    y: number
}


//#region Directions
export enum Direction {
    up = 0,
    right = 1,
    down = 2,
    left = 3
}

export type ModifiedDirection = Coordinate & {
    o: string
}

export type ModifiedDirections = {
    n: ModifiedDirection
    s: ModifiedDirection
    e: ModifiedDirection
    w: ModifiedDirection
}
//#endregion

export enum SpriteType {
    points = 0,
    lightPowerUp = 1
}

export interface Sprite {
    type: SpriteType
    image: HTMLImageElement
    coord: Coordinate
}


//#region Maze
export type MazeCell = {
    n: boolean
    s: boolean
    e: boolean
    w: boolean
    visited: boolean
    priorPos: Coordinate | null
}

export type MazeMap = MazeCell[][];
//#endregion


//#region Result
export type MoveResult = {
    clearNextCell: boolean
    clearPreviousCell: boolean
    canMove: boolean
    finished: boolean,
    gotPoints: number | null,
    redrawOverlay: boolean
}
//#endregion