import { Circle } from "./Circle.js";
import { Rectangle } from "./Rectangle.js";
import { Segment } from "./Segment.js";
import { Polygon } from "./Polygon.js";

export class Renderer {
    constructor(container) {
        this.container = container;
        this.graphics = new PIXI.Graphics();
        this.container.addChild(this.graphics);
    }

    draw(shapes = []) {
        for (const shape of shapes) {
            this.graphics.lineStyle(1, shape.lineColor || shape.color, shape.alpha || 1);
            this.graphics.beginFill(shape.color, shape.alpha || 1);
            if (shape instanceof Circle) {
                this.graphics.drawCircle(shape.x, shape.y, shape.radius);
            } else if (shape instanceof Rectangle) {
                this.graphics.drawRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape instanceof Segment) {
                this.graphics.moveTo(shape.x1, shape.y1);
                this.graphics.lineTo(shape.x2, shape.y2);
            } else if (shape instanceof Polygon) {
                this.graphics.moveTo(shape.points[0].x, shape.points[0].y);
                for (const point of shape.points.slice(1)) {
                    this.graphics.lineTo(point.x, point.y);
                }
                this.graphics.lineTo(shape.points[0].x, shape.points[0].y);
            }
        }
    }

    clear() {
        this.graphics.clear();
    }
}
