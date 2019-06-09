import Graphics from "./graphics/Graphics";

class Engine {
    public graphics: Graphics;
    private prevTimestamp: number;

    constructor(graphics: Graphics) {
        this.graphics = graphics;

        this.run = this.run.bind(this);
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.tick = this.tick.bind(this);
    }

    public run() {
        this.graphics.initialize();
        
        requestAnimationFrame(this.tick);
    }

    protected update(timestampOffset: number) {

    }

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
