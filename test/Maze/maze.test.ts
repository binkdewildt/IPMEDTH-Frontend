import Maze from "../../src/Models/Maze/Maze"
import MazeGenerator from "../../src/Models/Maze/MazeGenerator";
import { Coordinate, Direction, MazeCell, MoveResult, Sprite, SpriteType } from "../../src/Models/Maze/MazeModels";

describe("Maze", () => {
    const maze: Maze = new Maze(10, 10);

    // Test of de Start & End locatie uniek zijn van elkaar
    // Anders gaat het namelijk niet goed met de spawn van de player
    test("Check unique start & end locations", () => {
        let uniqueLocations: Set<Coordinate> = new Set([maze.start, maze.end])
        expect(uniqueLocations.size).toEqual(2);
    })


    // Test of alle sprites een unieke locatie hebben
    // Mogen dus ook niet hetzelfde zijn als de start & einde
    test("Check unique sprite locations", () => {
        let allCoordinates: Coordinate[] = [...maze.sprites.map(x => x.coord), maze.start, maze.end]
        let uniqueSprites: Set<Coordinate> = new Set(allCoordinates);

        expect(allCoordinates.length).toEqual(uniqueSprites.size);
    })


    // Test van de check-end
    // Is een private method, vandaar de andere notatie
    test("CheckEnd", () => {
        expect(maze['checkEnd'](maze.end)).toBe(true);
        expect(maze['checkEnd'](maze.start)).toBe(false);
    })


    // Test of het doolhof voltooid kan worden
    // Maakt gebruik van de Pledge Algorithm
    test("Check if the can be completed", () => {
        let testMaze = new Maze(10, 10);
        let maxLoops: number = testMaze.width * testMaze.height * 50;
        let currentLoop: number = 0;
        let done: boolean = false;

        let cellHasRightWall: boolean = false;
        let currentDirection: Direction = Direction.up;

        while (currentLoop < maxLoops && !done) {
            let coord: Coordinate = { ...testMaze.player.coord };
            let cell: MazeCell = testMaze.map[coord.x][coord.y];

            // Is het al het einde?
            if (coord.x === testMaze.end.x && coord.y === testMaze.end.y) {
                done = true;
                break;
            }

            // Is er rechts van de karakter een muur?
            if (currentDirection === Direction.up) { cellHasRightWall = !cell.e }
            else if (currentDirection === Direction.right) { cellHasRightWall = !cell.s }
            else if (currentDirection === Direction.down) { cellHasRightWall = !cell.w }
            else if (currentDirection === Direction.left) { cellHasRightWall = !cell.n }

            // Ja? Doe een stap naar voren
            if (cellHasRightWall) {
                let move: MoveResult = testMaze.move(currentDirection)!;

                // Kan dat niet? --> Draai 90 graden naar links om de rechtermuur te blijven volgen
                if (!move.canMove)
                    currentDirection = getTurnedDirection(currentDirection, Direction.left)
            }

            // Nee? Draai het karakter 90 graden naar rechts en doe een stap
            else {
                currentDirection = getTurnedDirection(currentDirection, Direction.right)
                testMaze.move(currentDirection);
            }

            currentLoop++;
        }

        expect(done).toBe(true);
    })


    //#region Moving
    // Testen of er punten terug worden gegeven bij het oppakken van een present
    test("Points per present", () => {
        let presentSprite: Sprite = maze.sprites.find(x => x.type === SpriteType.points)!;
        let cell: MazeCell = maze.map[presentSprite.coord.x][presentSprite.coord.y];

        // Set the player location
        let playerLocation: Coordinate = getPossibleMovementCellForCoordinate(cell, presentSprite.coord)
        let movementDir: Direction = getPossibleDirectionForCoordinates(playerLocation, presentSprite.coord);
        maze.player.coord = playerLocation;

        // Het bewegen van de player
        let moveResult: MoveResult | null = maze.move(movementDir);
        expect(moveResult).not.toBe(null);
        expect(moveResult!.canMove).toBe(true);
        expect(moveResult!.gotPoints).not.toBe(null);
    })


    // Testen of de gebruiker zich verplaatst naar het einde
    test("Check move to end", () => {
        let end: Coordinate = { ...maze.end };
        let cell: MazeCell = maze.map[end.x][end.y];

        // Set the player location
        let playerLocation: Coordinate = getPossibleMovementCellForCoordinate(cell, end)
        let movementDir: Direction = getPossibleDirectionForCoordinates(playerLocation, end);
        maze.player.coord = playerLocation;

        // Het bewegen van de player
        let moveResult: MoveResult | null = maze.move(movementDir);
        expect(moveResult).not.toBe(null);
        expect(moveResult!.canMove).toBe(true);
        expect(moveResult!.finished).toBe(true);
    })


    // Test of de player daadwerkelijk niet beweegt bij disabled moving
    test("Check disabled moving", () => {
        let oldCoords: Coordinate = { ...maze.player.coord };
        let cell: MazeCell = maze.map[oldCoords.x][oldCoords.y];
        let dir: Direction = Direction.up;

        maze.disableMoving = true;

        // Determine the right direction for the player to move
        if (cell.n) dir = Direction.up;
        else if (cell.e) dir = Direction.right;
        else if (cell.s) dir = Direction.down;
        else if (cell.w) dir = Direction.left;

        let moveResult: MoveResult | null = maze.move(dir);

        expect(moveResult).toBe(null);
        expect(oldCoords).toEqual(maze.player.coord);

        maze.disableMoving = false;
    })
    //#endregion


    //#region Sprites

    // Checken of de lightPowerUp daadwerkelijk de clipSize vergroot
    test("handleSprite", () => {
        let clipSize: number = MazeGenerator.clipSize;
        let sprite: Sprite = { type: SpriteType.lightPowerUp, coord: { x: 0, y: 0 }, image: new Image() }

        maze["handleSprite"](sprite);
        expect(MazeGenerator.clipSize).toBe(clipSize * 2);
    })

    // Checken of de speler op een sprite staat + of de sprite dan verwijderd wordt uit de array
    test("Check sprite", () => {
        let oldSprites: Sprite[] = [...maze.sprites];
        let spriteCoord: Coordinate = maze.sprites[0].coord;
        let foundSprite: Sprite | null = maze["checkSprite"](spriteCoord)
        let notFoundSprite: Sprite | null = maze["checkSprite"](maze.start)

        // Checken of de sprite gevonden is
        expect(foundSprite).not.toBe(null);
        expect(notFoundSprite).toBe(null);

        // Checken of de array.length -1 is --> foundSprite moet namelijk verwijderd zijn uit de array
        expect(maze.sprites.length).toBe(oldSprites.length - 1);
    })
    //#endregion


    //#region Helpers

    // Testen van de checkCoordinateInArray
    test("CheckCoordinateInArray", () => {
        let coords: Coordinate[] = [maze.start, maze.end];

        expect(maze['checkCoordinateInArray'](coords, maze.start)).toBe(true);
        expect(maze['checkCoordinateInArray'](coords, { x: 1, y: 1 })).toBe(false);
    })


    // Testen van de generateRandomCoord
    test("Check generateRandomCoord", () => {
        let rand: Coordinate = maze["generateRandomCoord"]();

        expect(rand.x).toBeGreaterThanOrEqual(0);
        expect(rand.y).toBeGreaterThanOrEqual(0);

        expect(rand.x).toBeLessThanOrEqual(maze.width);
        expect(rand.y).toBeLessThanOrEqual(maze.height);
    })
    //#endregion
})



function getPossibleMovementCellForCoordinate(cell: MazeCell, coord: Coordinate): Coordinate {
    let prevCoord: Coordinate = { ...coord };

    if (cell.n) prevCoord.y -= 1;
    else if (cell.e) prevCoord.x += 1;
    else if (cell.s) prevCoord.y += 1;
    else if (cell.w) prevCoord.x -= 1;

    return prevCoord;
}

function getPossibleDirectionForCoordinates(currentCoord: Coordinate, nextCoord: Coordinate): Direction {
    let dir: Direction = Direction.up;

    // De gebruiker stapt omhoog
    if (currentCoord.x === nextCoord.x && currentCoord.y > nextCoord.y) dir = Direction.up;

    // De gebruiker stapt omlaag
    else if (currentCoord.x === nextCoord.x && currentCoord.y < nextCoord.y) dir = Direction.down;

    // De gebruiker stapt naar rechts
    else if (currentCoord.x < nextCoord.x && currentCoord.y === nextCoord.y) dir = Direction.right;

    // De gebruiker stapt naar links
    else if (currentCoord.x > nextCoord.x && currentCoord.y === nextCoord.y) dir = Direction.left;

    return dir;
}

function getTurnedDirection(dir: Direction, turn: Direction): Direction {
    // Draai alles naar links
    if (turn === Direction.left) {
        if (dir === Direction.up) return Direction.left;
        else if (dir === Direction.left) return Direction.down;
        else if (dir === Direction.down) return Direction.right;
        else return Direction.up;
    }

    // Draai alles naar rechts
    else {
        if (dir === Direction.up) return Direction.right;
        else if (dir === Direction.right) return Direction.down;
        else if (dir === Direction.down) return Direction.left;
        else return Direction.up;
    }
}