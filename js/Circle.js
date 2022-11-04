export class Circle {
    constructor(args) {
        Object.assign(this, args);
    }

    get points() {
        const points = [];
        for (let i = 0; i < 2 * Math.PI; i += Math.PI * 0.01) {
            const angle = i;
            points.push({
                x: this.x + Math.cos(angle) * this.radius,
                y: this.y + Math.sin(angle) * this.radius,
            });
        }
        return points;
    }
}
