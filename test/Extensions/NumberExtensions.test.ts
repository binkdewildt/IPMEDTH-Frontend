import { pythagoras, random } from "../../src/Extensions/NumberExtensions"

describe("NumberExtensions", () => {


    // Checken of er een random getal terug komt
    test("Random", () => {
        let input: number = 10;
        let rand: number = random(input)

        expect(rand).toBeGreaterThan(0);
        expect(rand).toBeLessThanOrEqual(input);
    })

    // Checken of de pythagoras functie correct is
    test("Pythagoras", () => {
        expect(pythagoras(3, 4)).toBe(5);
    })
})