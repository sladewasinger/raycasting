import { Circle } from './js/Circle.js';
import { Line } from './js/Line.js';
import { Rectangle } from './js/Rectangle.js';
import { Renderer } from './js/Renderer.js';

const canvas = document.getElementById('canvas');
console.log(canvas);
export const app = new PIXI.Application({
    width: 800,
    height: 800,
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1,
    view: canvas,
});

const rect1 = new Rectangle({
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    color: 0xaa0011,
}, app.stage);

const rect2 = new Rectangle({
    x: 200,
    y: 250,
    width: 100,
    height: 100,
    color: 0x00ff00,
}, app.stage);

const circle = new Circle({
    x: 600,
    y: 400,
    radius: 50,
    color: 0x0000ff,
}, app.stage);

const lightSource = new Circle({
    x: 400,
    y: 300,
    radius: 5,
    color: 0xffff00,
}, app.stage);

const mousePos = {
    x: 0,
    y: 0,
};

function mouseMove(e) {
    var rect = canvas.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;
}
window.addEventListener('mousemove', mouseMove);

const renderer = new Renderer(app.stage);

function loop() {
    renderer.clear();

    lightSource.x = mousePos.x;
    lightSource.y = mousePos.y;

    const vertexes = [...rect1.points, ...rect2.points, ...circle.points];
    let rays = vertexes.map(vertex => {
        const ray = new Line({
            x1: lightSource.x,
            y1: lightSource.y,
            x2: vertex.x,
            y2: vertex.y,
            color: 0xffffff,
        });
        return ray;
    });
    const boundingRect = new Rectangle({
        x: 0,
        y: 0,
        width: 800,
        height: 800,
    });
    rays.push(new Line({
        x1: lightSource.x,
        y1: lightSource.y,
        x2: boundingRect.x,
        y2: boundingRect.y,
        color: 0xffffff,
    }));
    rays.push(new Line({
        x1: lightSource.x,
        y1: lightSource.y,
        x2: boundingRect.x + boundingRect.width,
        y2: boundingRect.y,
        color: 0xffffff,
    }));
    rays.push(new Line({
        x1: lightSource.x,
        y1: lightSource.y,
        x2: boundingRect.x,
        y2: boundingRect.y + boundingRect.height,
        color: 0xffffff,
    }));
    rays.push(new Line({
        x1: lightSource.x,
        y1: lightSource.y,
        x2: boundingRect.x + boundingRect.width,
        y2: boundingRect.y + boundingRect.height,
        color: 0xffffff,
    }));

    renderer.draw([rect1, rect2, circle, lightSource]);

    for (const ray of rays) {
        const intersectionPoints = [];
        for (const shape of [rect1, rect2]) {
            const vertices = [...shape.points];
            for (let i = 0; i < vertices.length; i++) {
                const vertex1 = vertices[i];
                const vertex2 = vertices[(i + 1) % vertices.length];
                const line = new Line({
                    x1: vertex1.x,
                    y1: vertex1.y,
                    x2: vertex2.x,
                    y2: vertex2.y,
                    color: 0xff0000,
                });
                renderer.draw([line]);
                const intersection = ray.intersect(line);
                if (!!intersection) {
                    intersectionPoints.push(intersection);
                    ray.x2 = intersection.x; // Indirectly sort the ray by adjusting it's end point every time
                    ray.y2 = intersection.y;
                }
            }
        }
    }

    renderer.draw(rays);
}
app.ticker.add(loop);
