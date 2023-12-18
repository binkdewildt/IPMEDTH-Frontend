export default class MazeGenerator {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    // Constructor
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }
}