import Engine from "../engine/Engine";
import Graphics from "../engine/graphics/Graphics";
import Cube from "./assets/Cube";
import ScrubsPicture from "./assets/ScrubsPicture";
import Object2 from "../engine/graphics/Object2";
import Object3 from "../engine/graphics/Object3";
import { degreesToRadians } from "../engine/math/angle";

class Game extends Engine {
    private first: Object2;
    private second: Object3;

    constructor(graphics: Graphics) {
        super(graphics);
        
        this.run = this.run.bind(this);
        this.render = this.render.bind(this);
    }

    run() {
        this.graphics.loadObjectAsset(Cube);
        this.graphics.loadRelatedAsset(ScrubsPicture);

        this.first = new Object2(ScrubsPicture.key);
        this.first.origin = [0, 0];
        this.first.translation = [1, 1];
        this.first.scale = [1, 1];

        this.second = new Object3(Cube.key);
        this.second.translation = [0, 0, -400];
        this.second.rotation = [degreesToRadians(10), degreesToRadians(10), 0];
        this.second.scale = [1, 1, 1];

        super.run();
    }

    render() {
        super.render();
        this.graphics.renderObject3(this.second);
        this.graphics.renderObject2(this.first);
    }
}

export default Game;