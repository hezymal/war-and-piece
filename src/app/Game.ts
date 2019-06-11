import Engine from "engine/Engine";
import Graphics from "engine/graphics/Graphics";
import Mouse, { MouseOptions } from "engine/inputs/Mouse";
import Object2 from "engine/graphics/Object2";
import Object3 from "engine/graphics/Object3";
import { degreesToRadians } from "engine/math/angle";
import Cube from "./assets/Cube";
import ScrubsPicture from "./assets/ScrubsPicture";
import Camera from "engine/graphics/Camera";

class Game extends Engine {
    private camera: Camera;
    private first: Object2;
    private second: Object3;

    constructor(element: HTMLCanvasElement, graphics: Graphics, mouse: Mouse) {
        super(element, graphics, mouse);
        
        this.initialize = this.initialize.bind(this);
        this.run = this.run.bind(this);
        this.render = this.render.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
    }
    
    initialize() {
        super.initialize();

        this.graphics.loadObjectAsset(Cube);
        this.graphics.loadRelatedAsset(ScrubsPicture);
        this.mouse.subscribe("MOVE", this.mouseMove);

        this.camera = new Camera();
        this.graphics.setCurrentCamera(this.camera);
        this.graphics.setFieldOfView(degreesToRadians(45));

        this.first = new Object2(ScrubsPicture.key);
        this.first.origin = [-15, -15];
        this.first.scale = [30, 30];

        this.second = new Object3(Cube.key);
        this.second.translation = [0, 0, -400];
        this.second.rotation = [degreesToRadians(10), degreesToRadians(10), 0];
        this.second.scale = [1, 1, 1];

        return this;
    }

    protected render() {
        super.render();
        this.graphics.renderObject3(this.second);
        this.graphics.renderObject2(this.first);
    }

    private mouseMove(options: MouseOptions) {
        console.log(options);
        this.camera.rotation[1] += 
            options.movementX < 0 ? -0.01 : 
            options.movementX > 0 ? 0.01 :
            options.movementX === 0 && !options.x ? -0.01 : 0.01;
    }

    static factory(elementId: string) {
        const canvas = document.getElementById(elementId) as HTMLCanvasElement;
        const graphics = Graphics.factory(canvas);
        const mouse = Mouse.factory(canvas);
        
        return new Game(canvas, graphics, mouse);
    }
}

export default Game;
