import Observable, { Observer } from "engine/utils/Observable";

export type MouseOptions = { 
    x: number; 
    y: number;
    movementX: number; 
    movementY: number;
};
type EventKey = "MOVE" | "UP" | "DOWN";
type EventListener = Observer<MouseOptions>;

class Mouse {
    private moveObservable: Observable<MouseOptions>;
    private upObservable: Observable<MouseOptions>;
    private downObservable: Observable<MouseOptions>;

    constructor() {
        this.moveObservable = new Observable<MouseOptions>();
        this.upObservable = new Observable<MouseOptions>();
        this.downObservable = new Observable<MouseOptions>();

        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleUp = this.handleUp.bind(this);
        this.handleDown = this.handleDown.bind(this);
        this.eventToOptions = this.eventToOptions.bind(this);
    }

    subscribe(eventKey: EventKey, listener: EventListener) {
        switch (eventKey) {
            case "MOVE": this.moveObservable.subscribe(listener); break;
            case "UP": this.upObservable.subscribe(listener); break;
            case "DOWN": this.downObservable.subscribe(listener); break;
        }
    }

    unsubscribe(eventKey: EventKey, listener: EventListener) {
        switch (eventKey) {
            case "MOVE": this.moveObservable.unsubscribe(listener); break;
            case "UP": this.upObservable.unsubscribe(listener); break;
            case "DOWN": this.downObservable.unsubscribe(listener); break;
        }
    }

    private handleMove(e: MouseEvent) {
        this.moveObservable.broadcast(this.eventToOptions(e));
    }

    private handleUp(e: MouseEvent) {
        this.upObservable.broadcast(this.eventToOptions(e));
    }

    private handleDown(e: MouseEvent) {
        this.downObservable.broadcast(this.eventToOptions(e));
    }

    private eventToOptions(e: MouseEvent): MouseOptions {
        console.log(e.layerX, e.movementX, e.offsetX, e.pageX, e.screenX, e.x);
        return {
            x: e.clientX,
            y: e.clientY,
            movementX: e.movementX,
            movementY: e.movementY,
        };
    }

    static factory(canvas: HTMLCanvasElement): Mouse {
        const mouse = new Mouse();

        canvas.addEventListener("mousemove", mouse.handleMove);
        canvas.addEventListener("mouseup", mouse.handleUp);
        canvas.addEventListener("mousedown", mouse.handleDown);

        return mouse;
    }
}

export default Mouse;
