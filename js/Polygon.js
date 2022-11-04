
export class Polygon {
    constructor({ points = [], color = 0xffffff, alpha = 1, blur = false }) {
        this.points = points;
        this.color = color;
        this.alpha = alpha;
        this.blur = blur;
    }

    translate({ x = 0, y = 0 }) {
        for (const point of this.points) {
            point.x += x;
            point.y += y;
        }
    }
}
