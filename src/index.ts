import Graphics from "./Graphics";
import ScrubsPicture from "./assets/ScrubsPicture";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const webgl = canvas.getContext("webgl");
const graphics = new Graphics(webgl);

const triangle = graphics.createObject3D(ScrubsPicture);
triangle.origin = [-50, -50];
triangle.translation = [150, 150];
triangle.angleInDegrees = 45;
triangle.scale = [2, 2];

function render() {
    graphics.render([triangle]);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
