import Game from "./Game";
import Graphics from "../engine/graphics/Graphics";

function gameFactory(elementId: string) {
    const canvas = document.getElementById(elementId) as HTMLCanvasElement;
    const webgl = canvas.getContext("webgl");
    const graphics = new Graphics(webgl);
    return new Game(graphics);
}

export default gameFactory;
