import Maze from "../../src/Models/Maze/Maze"
import { Coordinate } from "../../src/Models/Maze/MazeModels";

describe("Maze", () => {
    const maze: Maze = new Maze(10, 10);


    // Test of alle sprites een unieke locatie hebben
    // Mogen dus ook niet hetzelfde zijn als de start & einde
    test("Check unique sprite locations", () => {
        let allCoordinates: Coordinate[] = [...maze.sprites.map(x => x.coord), maze.start, maze.end]
        let uniqueSprites: Set<Coordinate> = new Set(allCoordinates);

        expect(allCoordinates.length).toEqual(uniqueSprites.size);
    })
})