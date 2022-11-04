export class Segment {
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

    extend(length) {
        const angle = this.angle;
        return new Segment({
            x1: this.x1,
            y1: this.y1,
            x2: this.x1 + Math.cos(angle) * length,
            y2: this.y1 + Math.sin(angle) * length,
            color: this.color,
        });
    }

    // http://paulbourke.net/geometry/pointlineplane/javascript.txt
    intersect(segment) {
        const x1 = this.x1;
        const y1 = this.y1;
        const x2 = this.x2;
        const y2 = this.y2;
        const x3 = segment.x1;
        const y3 = segment.y1;
        const x4 = segment.x2;
        const y4 = segment.y2;
        // Check if none of the lines are of length 0
        if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
            return false
        }

        const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

        // Lines are parallel
        if (denominator === 0) {
            return false
        }

        let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
        let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

        // is the intersection along the segments
        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return false
        }

        // Return a object with the x and y coordinates of the intersection
        let x = x1 + ua * (x2 - x1)
        let y = y1 + ua * (y2 - y1)

        return { x, y }
    }
}
