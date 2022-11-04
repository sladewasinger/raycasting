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
    color: 0xff0000,
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
    // rect1.draw();
    // rect2.draw();
    // circle.draw();
    lightSource.x = mousePos.x;
    lightSource.y = mousePos.y;
    // lightSource.draw();

    const vertexes = [...rect1.points];
    const rays = vertexes.map(vertex => {
        const ray = new Line({
            x1: lightSource.x,
            y1: lightSource.y,
            x2: vertex.x,
            y2: vertex.y,
            color: 0xffffff,
        });
        return ray;
    });
    rays.forEach((ray, index) => {
        ray.x1 = lightSource.x;
        ray.y1 = lightSource.y;
        ray.x2 = vertexes[index].x;
        ray.y2 = vertexes[index].y;
    });
    const shapes = [rect1, rect2, circle, lightSource, ...rays];
    renderer.draw2(shapes);
}
app.ticker.add(loop);
