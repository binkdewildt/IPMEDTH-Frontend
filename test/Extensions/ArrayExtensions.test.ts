import { shuffle } from "../../src/Extensions/ArrayExtensions"

describe("ArrayExtensions", () => {
    const input: number[] = [1, 2, 3, 4, 5]

    // Checken of de geshuffelde versie van de array
    // niet meer hetzelfde is als de originele array
    test("Shuffle", () => {
        let shuffled = shuffle(input);
        expect(input).not.toEqual(shuffled);
    })
})