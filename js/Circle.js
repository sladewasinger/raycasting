export class Circle {
    constructor({ x, y, radius, color }, container) {
        this.x = x;
        this.y = y;
        this.radius = radius;
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
        this.graphics.drawCircle(this.x, this.y, this.radius);
        this.graphics.endFill();
    }

    get points() {
        return this.graphics.geometry.points.reduce((acc, value, index, array) => {
            if (index % 2 === 0) {
                acc.push({ x: value, y: array[index + 1] });
            }
            return acc;
        }, []);
    }
}
