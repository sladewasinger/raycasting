import { Circle } from './js/Circle.js';
import { Segment } from './js/Segment.js';
import { Rectangle } from './js/Rectangle.js';
import { Renderer } from './js/Renderer.js';
import { Polygon } from './js/Polygon.js';

const canvas = document.getElementById('canvas');
console.log(canvas);
export const app = new PIXI.Application({
    width: 800,
    height: 800,
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1,
    view: canvas,
});

const container = new PIXI.Container();
app.stage.addChild(container);
container.cursor = 'crosshair';


const rect1 = new Rectangle({
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    color: 0xaa0011,
}, container);

const rect2 = new Rectangle({
    x: 200,
    y: 250,
    width: 50,
    height: 50,
    color: 0x00ff00,
}, container);

const rect3 = new Rectangle({
    x: 600,
    y: 150,
    width: 100,
    height: 100,
    color: 0x0000ff,
}, container);

const circle = new Circle({
    x: 600,
    y: 400,
    radius: 50,
    color: 0x0000ff,
}, container);

const randomShape = new Polygon({
    points: [
        { x: 100, y: 0 },
        { x: 200, y: 100 },
        { x: 0, y: 100 },
    ],
    color: 0x00ffff,
}, container);

randomShape.translate({ x: 300, y: 300 });

const pacmanPoints = []
let hasCenter = false;
for (let i = 0; i < 2 * Math.PI; i += Math.PI * 0.05) {
    const angle = i;
    if (i > Math.PI * 1.6 && i < Math.PI * 2) {
        if (!hasCenter) {
            hasCenter = true;
            pacmanPoints.push({
                x: 0,
                y: 0,
            });
        }
    }
    else {
        pacmanPoints.push({
            x: + Math.cos(angle) * 50,
            y: + Math.sin(angle) * 50,
        });
    }
}
const pacman = new Polygon({
    points: pacmanPoints,
    color: 0xffff00,
}, container);
pacman.translate({ x: 400, y: 600 });

const lightSource = new Circle({
    x: 400,
    y: 300,
    radius: 5,
    color: 0xffff00,
    lineColor: 0x000000,
}, container);

const shapes = [rect1, rect2, rect3, circle, randomShape, pacman];

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

const renderer = new Renderer(container);
const lightBulb = PIXI.Sprite.from('assets/lightbulb.png');
lightBulb.anchor.set(0.5);

// scale lightbulb to 25 px
lightBulb.scale.set(0.25);

container.addChild(lightBulb);

function loop() {
    renderer.clear();

    lightSource.x = mousePos.x;
    lightSource.y = mousePos.y;
    lightBulb.x = mousePos.x;
    lightBulb.y = mousePos.y;

    const vertexes = shapes.map(shape => shape.points).flat();
    let rays = vertexes.map(vertex => {
        const ray = new Segment({
            x1: lightSource.x,
            y1: lightSource.y,
            x2: vertex.x,
            y2: vertex.y,
            color: 0xffffff,
        });
        return ray;
    });
    const secondaryRays = [];
    for (const ray of rays) {
        // create another ray rotated from ray
        const angle = Math.PI * 0.001;
        const x2 = ray.x1 + (ray.x2 - ray.x1) * Math.cos(angle) - (ray.y2 - ray.y1) * Math.sin(angle);
        const y2 = ray.y1 + (ray.y2 - ray.y1) * Math.cos(angle) + (ray.x2 - ray.x1) * Math.sin(angle);

        let rightRay = new Segment({
            x1: ray.x1,
            y1: ray.y1,
            x2: x2,
            y2: y2,
            color: 0xff0000,
        });

        // create another ray rotated the other way from ray
        const x3 = ray.x1 + (ray.x2 - ray.x1) * Math.cos(-angle) - (ray.y2 - ray.y1) * Math.sin(-angle);
        const y3 = ray.y1 + (ray.y2 - ray.y1) * Math.cos(-angle) + (ray.x2 - ray.x1) * Math.sin(-angle);

        let leftRay = new Segment({
            x1: ray.x1,
            y1: ray.y1,
            x2: x3,
            y2: y3,
            color: 0x00ff00,
        });

        rightRay = rightRay.extend(Number.MAX_SAFE_INTEGER);
        leftRay = leftRay.extend(Number.MAX_SAFE_INTEGER);

        secondaryRays.push(rightRay);
        secondaryRays.push(leftRay);
    }

    rays = [...rays, ...secondaryRays];

    const boundingRect = new Rectangle({
        x: 0,
        y: 0,
        width: 800,
        height: 800,
    });
    rays.push(new Segment({
        x1: lightSource.x, y1: lightSource.y, x2: boundingRect.x, y2: boundingRect.y, color: 0xffffff,
    }));
    rays.push(new Segment({
        x1: lightSource.x, y1: lightSource.y, x2: boundingRect.x + boundingRect.width, y2: boundingRect.y, color: 0xffffff,
    }));
    rays.push(new Segment({
        x1: lightSource.x, y1: lightSource.y, x2: boundingRect.x, y2: boundingRect.y + boundingRect.height, color: 0xffffff,
    }));
    rays.push(new Segment({
        x1: lightSource.x, y1: lightSource.y, x2: boundingRect.x + boundingRect.width, y2: boundingRect.y + boundingRect.height, color: 0xffffff,
    }));

    renderer.draw(shapes);

    for (const ray of rays) {
        const intersectionPoints = [];
        for (const shape of shapes) {
            const vertices = [...shape.points];
            for (let i = 0; i < vertices.length; i++) {
                const vertex1 = vertices[i];
                const vertex2 = vertices[(i + 1) % vertices.length];
                const line = new Segment({
                    x1: vertex1.x,
                    y1: vertex1.y,
                    x2: vertex2.x,
                    y2: vertex2.y,
                    color: 0xff0000,
                });
                // renderer.draw([line]);
                const intersection = ray.intersect(line);
                if (!!intersection) {
                    intersectionPoints.push(intersection);
                    ray.x2 = intersection.x; // Indirectly sort the ray by adjusting it's end point every time
                    ray.y2 = intersection.y;
                }
            }
        }
    }

    // order rays by angle
    rays.sort((a, b) => {
        const angleA = Math.atan2(a.y2 - a.y1, a.x2 - a.x1);
        const angleB = Math.atan2(b.y2 - b.y1, b.x2 - b.x1);
        return angleA - angleB;
    });

    // connect rays as triangles
    for (let i = 0; i < rays.length; i++) {
        const ray1 = rays[i];
        const ray2 = rays[(i + 1) % rays.length];
        const triangle = new Polygon({
            points: [
                { x: ray1.x1, y: ray1.y1 },
                { x: ray1.x2, y: ray1.y2 },
                { x: ray2.x2, y: ray2.y2 },
            ],
            color: 0xf8f5d8,
            alpha: 1,
            blur: true
        });
        renderer.draw([triangle]);
    }

    // create mask and blur it


    renderer.draw([lightSource]);
    if (false) {
        renderer.draw(rays);
    }
}
app.ticker.add(loop);
