import Graphics from "./graphics/Graphics";
import Cube from "./assets/Cube";
import ScrubsPicture from "./assets/ScrubsPicture";
import Object2 from "./graphics/Object2";
import Object3 from "./graphics/Object3";
import { degreesToRadians } from "./math/angle";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const webgl = canvas.getContext("webgl");
const graphics = new Graphics(webgl);

graphics.loadAsset(Cube);
graphics.loadAsset(ScrubsPicture);

const first = new Object2(ScrubsPicture.key);
first.origin = [-50, -50];
first.translation = [150, 150];
first.angleInDegrees = 45;
first.scale = [2, 2];

const second = new Object3(Cube.key);
second.rotation[0] = degreesToRadians(10);
second.rotation[1] = degreesToRadians(10);
second.scale = [0.005, 0.005, 0.005];

function render() {
    graphics.beginRender();
    //graphics.renderObject2(first);
    graphics.renderObject3(second);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
