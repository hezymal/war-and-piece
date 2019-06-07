import * as vertexShaderSource from "./vertex-shader.glsl";
import * as fragmentShaderSource from "./fragment-shader.glsl";
import * as texture from "./texture.jpg";
import Graphics from "./Graphics";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const webgl = canvas.getContext("webgl");
const graphics = new Graphics(webgl);
const vertices = [
    0, 0,
    100, 0,
    100, 100,
    0, 100,
];
const indices = [
    0, 1, 2, 
    2, 3, 0
];
const texcoords = [
    0, 0, 
    1, 0,
    1, 1,
    0, 1,
];
const triangle = graphics.createObject3D(
    vertices, 
    indices,
    texcoords,
    vertexShaderSource, 
    fragmentShaderSource
);
triangle.origin = [-50, -50];
triangle.translation = [150, 150];
triangle.angleInDegrees = 45;
triangle.scale = [2, 2];
graphics.loadTexture(triangle, texture);

function render() {
    graphics.render([triangle]);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
