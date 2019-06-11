import Graphics from "./graphics/Graphics";
import Mouse from "./inputs/Mouse";

class Engine {
    protected element: HTMLCanvasElement;
    protected graphics: Graphics;
    protected mouse: Mouse;
    private prevTimestamp: number;

    constructor(element: HTMLCanvasElement, graphics: Graphics, mouse: Mouse) {
        this.element = element;
        this.graphics = graphics;
        this.mouse = mouse;

        this.initialize = this.initialize.bind(this);
        this.run = this.run.bind(this);
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.tick = this.tick.bind(this);
    }

    initialize() {
        this.element.style.cursor = "none";
        this.graphics.initialize();

        return this;
    }

    run() {
        requestAnimationFrame(this.tick);
    }

    protected update(timestampOffset: number) {}

    protected render() {
        this.graphics.beginRender();
    }

    private tick(timestamp: number) {
        this.update(timestamp - this.prevTimestamp);
        this.render();

        this.prevTimestamp = timestamp;
        requestAnimationFrame(this.tick);
    }
}

export default Engine;
