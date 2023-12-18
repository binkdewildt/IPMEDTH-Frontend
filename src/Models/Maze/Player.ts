import { Coordinate } from "./MazeModels";

export default class Player {
    public coord: Coordinate


    constructor(coord: Coordinate) {
        this.coord = coord;
    }
}