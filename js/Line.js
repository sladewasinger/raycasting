export class Line {
    constructor({ x1, y1, x2, y2, color }) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = color;
    }

    get length() {
        return Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2));
    }

    get angle() {
        return Math.atan2(this.y2 - this.y1, this.x2 - this.x1);
    }

    get normal() {
        const angle = this.angle + Math.PI / 2;
        return new Line({
            x1: this.x1,
            y1: this.y1,
            x2: this.x1 + Math.cos(angle),
            y2: this.y1 + Math.sin(angle),
        });
    }

    scale(factor) {
        const length = this.length * factor;
        return new Line({
            x1: this.x1,
            y1: this.y1,
            x2: this.x1 + Math.cos(this.angle) * length,
            y2: this.y1 + Math.sin(this.angle) * length,
        });
    }
}
