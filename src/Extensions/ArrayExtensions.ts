// Changes the array by reference
export function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;
    let copiedArray = [...array]

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [copiedArray[currentIndex], copiedArray[randomIndex]] = [
            copiedArray[randomIndex], copiedArray[currentIndex]];
    }

    return copiedArray;
}