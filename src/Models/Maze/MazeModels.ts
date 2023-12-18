export type Coordinate = {
    x: number,
    y: number
}

export enum Direction {
    north = 0,
    east = 1,
    south = 2,
    west = 3,
}

export type Present = {
    image: HTMLImageElement
    coord: Coordinate
}

export type MazeCell = {
    n: boolean
    s: boolean
    e: boolean
    w: boolean
    visited: boolean
    priorPos: Coordinate | null
}

export type MazeMap = MazeCell[][];