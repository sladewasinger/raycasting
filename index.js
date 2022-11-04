import { Circle } from './js/Circle.js';
import { Segment } from './js/Segment.js';
import { Rectangle } from './js/Rectangle.js';
import { Polygon } from './js/Polygon.js';

const canvas = document.getElementById('canvas');

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
    color: 0x0000ff,
}, container);

const rect2 = new Rectangle({
    x: 200,
    y: 250,
    width: 50,
    height: 50,
    color: 0x0000ff,
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
    color: 0x0000ff,
}, container);

randomShape.translate({ x: 300, y: 300 });

const pacmanPoints = []
let hasCenter = false;
for (let i = 0; i < 2 * Math.PI; i += Math.PI * 0.05) {
    const angle = i;
    const radius = 100;
    if (i > Math.PI * 1.7 && i < Math.PI * 2) {
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
            x: + Math.cos(angle) * radius,
            y: + Math.sin(angle) * radius,
        });
    }
}
const pacman = new Polygon({
    points: pacmanPoints,
    color: 0x0000ff,
}, container);
pacman.translate({ x: 400, y: 600 });

const lightSource = new Circle({
    x: 400,
    y: 300,
    radius: 10,
    color: 0xffff00,
    lineColor: 0xaaaaaa,
    lineWidth: 1,
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
    if (mousePos.x < 0) {
        mousePos.x = 0;
    }
    if (mousePos.y < 0) {
        mousePos.y = 0;
    }
    if (mousePos.x > app.screen.width) {
        mousePos.x = app.screen.width - 1;
    }
    if (mousePos.y > app.screen.height) {
        mousePos.y = app.screen.height - 1;
    }
}
window.addEventListener('mousemove', mouseMove);

const layer1 = new PIXI.Graphics();
container.addChild(layer1);

const layer2 = new PIXI.Graphics();
layer2.filters = [new PIXI.filters.BlurFilter(5, 5)];
container.addChild(layer2);

const layer3 = new PIXI.Graphics();
container.addChild(layer3);

const maskLayer = new PIXI.Graphics();


function loop() {
    layer1.clear();
    layer2.clear();
    layer3.clear();
    maskLayer.clear();

    lightSource.x = mousePos.x;
    lightSource.y = mousePos.y;

    // create rays from light source to all shapes' vertexes
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

    // create secondary rays rotated just ouside intersection points
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
        // leftRay.draw(layer3);
        // rightRay.draw(layer3);
    }
    //rays = [...rays, ...secondaryRays];

    // add bounding box rays
    const boundingRect = new Rectangle({
        x: 0,
        y: 0,
        width: 800,
        height: 800,
    });
    rays.push(new Segment({ x1: lightSource.x, y1: lightSource.y, x2: boundingRect.x, y2: boundingRect.y, color: 0xffffff }));
    rays.push(new Segment({ x1: lightSource.x, y1: lightSource.y, x2: boundingRect.x + boundingRect.width, y2: boundingRect.y, color: 0xffffff }));
    rays.push(new Segment({ x1: lightSource.x, y1: lightSource.y, x2: boundingRect.x, y2: boundingRect.y + boundingRect.height, color: 0xffffff }));
    rays.push(new Segment({ x1: lightSource.x, y1: lightSource.y, x2: boundingRect.x + boundingRect.width, y2: boundingRect.y + boundingRect.height, color: 0xffffff }));

    const secondaryRaysCopy = [...secondaryRays.map(ray => ray.clone())];
    rays = [...rays, ...secondaryRays];

    // limit rays to closest intersection
    for (const ray of rays) {
        const intersectionPoints = [];
        for (const shape of shapes) {
            const vertices = shape.points;
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
                const intersection = ray.intersect(line);
                // as ray gets shorter it will eventually be at the closest intersection point
                if (!!intersection) {
                    intersectionPoints.push(intersection);
                    ray.x2 = intersection.x;
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

    // draw shapes
    for (const shape of shapes) {
        shape.draw(layer1);
    }

    // connect rays as triangles and draw them
    const triangles = [];
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
            alpha: 1
        });
        triangles.push(triangle);
        triangle.draw(layer2);
    }

    // mask out hidden shapes
    // check if ray intersects shape
    const overlappingSegments = [];

    for (const ray of secondaryRaysCopy) {
        let intersectionPoints = [];
        for (const shape of shapes) {
            const vertices = shape.points;
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
                const intersection = ray.intersect(line);
                // as ray gets shorter it will eventually be at the closest intersection point
                if (!!intersection) {
                    intersectionPoints.push(intersection);
                }
            }
        }
        intersectionPoints = intersectionPoints.sort((a, b) => {
            const distanceA = Math.sqrt(Math.pow(a.x - ray.x1, 2) + Math.pow(a.y - ray.y1, 2));
            const distanceB = Math.sqrt(Math.pow(b.x - ray.x1, 2) + Math.pow(b.y - ray.y1, 2));
            return distanceA - distanceB;
        }).slice(0, 2);

        const furthestIntersection = intersectionPoints.sort((a, b) => {
            const distanceA = Math.sqrt(Math.pow(a.x - ray.x1, 2) + Math.pow(a.y - ray.y1, 2));
            const distanceB = Math.sqrt(Math.pow(b.x - ray.x1, 2) + Math.pow(b.y - ray.y1, 2));
            return distanceB - distanceA;
        })[0];
        if (!!furthestIntersection) {
            let segment = new Segment({
                x1: ray.x1,
                y1: ray.y1,
                x2: furthestIntersection.x,
                y2: furthestIntersection.y,
                color: 0xff00ff,
            });
            overlappingSegments.push(segment);
        }
    }

    // order overlappingSegments by angle
    overlappingSegments.sort((a, b) => {
        const angleA = Math.atan2(a.y2 - a.y1, a.x2 - a.x1);
        const angleB = Math.atan2(b.y2 - b.y1, b.x2 - b.x1);
        return angleA - angleB;
    });

    const overlappingTriangles = [];
    for (let i = 0; i < overlappingSegments.length; i++) {
        const ray1 = overlappingSegments[i];
        const ray2 = overlappingSegments[(i + 1) % overlappingSegments.length];
        const triangle = new Polygon({
            points: [
                { x: ray1.x1, y: ray1.y1 },
                { x: ray1.x2, y: ray1.y2 },
                { x: ray2.x2, y: ray2.y2 },
            ],
            color: 0xffff00,
            alpha: 1
        });
        overlappingTriangles.push(triangle);
        triangle.draw(maskLayer);
    }
    layer1.mask = maskLayer;

    lightSource.draw(layer3)
}
app.ticker.add(loop);
