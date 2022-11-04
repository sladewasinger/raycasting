export class Circle {
    constructor({ x, y, radius, color = 0x0000ff, lineWidth = 1, lineColor = 0x000000, alpha = 1 }) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.lineWidth = lineWidth;
        this.lineColor = lineColor;
        this.alpha = alpha;
    }

    get points() {
        const points = [];
        for (let i = 0; i < 2 * Math.PI; i += Math.PI * 0.05) {
            const angle = i;
            points.push({
                x: this.x + Math.cos(angle) * this.radius,
                y: this.y + Math.sin(angle) * this.radius,
            });
        }
        return points;
    }

    draw(graphics) {
        graphics.lineStyle(this.lineWidth, this.lineColor, this.alpha);
        graphics.beginFill(this.color, this.alpha);
        graphics.drawCircle(this.x, this.y, this.radius);
    }
}
