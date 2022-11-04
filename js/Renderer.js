import { Circle } from "./Circle.js";
import { Rectangle } from "./Rectangle.js";
import { Line } from "./Line.js";

export class Renderer {
    constructor(container) {
        this.container = container;
        this.graphics = new PIXI.Graphics();
        this.container.addChild(this.graphics);
    }

    draw(shapes = []) {
        for (const shape of shapes) {
            this.graphics.lineStyle(1, shape.color);
            this.graphics.beginFill(shape.color);
            if (shape instanceof Circle) {
                this.graphics.drawCircle(shape.x, shape.y, shape.radius);
            } else if (shape instanceof Rectangle) {
                this.graphics.drawRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape instanceof Line) {
                this.graphics.moveTo(shape.x1, shape.y1);
                this.graphics.lineTo(shape.x2, shape.y2);
            }
        }
    }

    clear() {
        this.graphics.clear();
    }
}
