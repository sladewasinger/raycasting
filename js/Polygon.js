
export class Polygon {
    constructor({ points = [], color = 0xffffff, alpha = 1 }) {
        this.points = points;
        this.color = color;
        this.alpha = alpha;
    }

    draw(graphics) {
        graphics.lineStyle(1, this.color, this.alpha);
        graphics.beginFill(this.color, this.alpha);
        graphics.moveTo(this.points[0].x, this.points[0].y);
        for (const point of this.points.slice(1)) {
            graphics.lineTo(point.x, point.y);
        }
        graphics.lineTo(this.points[0].x, this.points[0].y);
    }

    translate({ x = 0, y = 0 }) {
        for (const point of this.points) {
            point.x += x;
            point.y += y;
        }
    }
}
