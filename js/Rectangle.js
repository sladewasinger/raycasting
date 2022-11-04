export class Rectangle {
    constructor({ x, y, width, height, color }) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    get points() {
        return [
            new PIXI.Point(this.x, this.y),
            new PIXI.Point(this.x + this.width, this.y),
            new PIXI.Point(this.x + this.width, this.y + this.height),
            new PIXI.Point(this.x, this.y + this.height),
        ];
    }
}
