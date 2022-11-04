export class Rectangle {
    constructor({ x, y, width, height, color }, container) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.container = container;
        this.drawn = false;

        this.graphics = new PIXI.Graphics();
    }

    draw() {
        if (!this.drawn) {
            this.container.addChild(this.graphics);
            this.drawn = true;
        }

        this.graphics.clear();
        this.graphics.beginFill(this.color);
        this.graphics.drawRect(this.x, this.y, this.width, this.height);
        this.graphics.endFill();
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
