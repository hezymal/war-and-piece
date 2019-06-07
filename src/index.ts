import Graphics from "./graphics/Graphics";
import ScrubsPicture from "./assets/ScrubsPicture";
import Object2D from "./graphics/Object2D";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const webgl = canvas.getContext("webgl");
const graphics = new Graphics(webgl);

graphics.loadAsset(ScrubsPicture);

const first = new Object2D(ScrubsPicture.key);
first.origin = [-50, -50];
first.translation = [150, 150];
first.angleInDegrees = 45;
first.scale = [2, 2];

const second = new Object2D(ScrubsPicture.key);
second.origin = [-50, -50];
second.translation = [250, 150];
second.angleInDegrees = 0;
second.scale = [2, 2];

function render() {
    graphics.beginRender();
    graphics.renderObject2D(first);
    graphics.renderObject2D(second);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
