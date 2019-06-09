import Vector2 from "engine/math/Vector2";
import * as matrix4 from "engine/math/Matrix4";
import { degreesToRadians } from "engine/math/angle";
import RenderingManager from "./assets/RenderingManager";
import ObjectAsset from "./assets/ObjectAsset";
import RelatedAsset from "./assets/RelatedAsset";
import Object3 from "./Object3";
import Object2 from "./Object2";
import ImageAsset from "./standardAssets/Image";

class Graphics {
    private readonly webgl: WebGLRenderingContext;
    private readonly renderingManager: RenderingManager;
    public readonly loadObjectAsset: (asset: ObjectAsset) => void;
    public readonly loadRelatedAsset: (asset: RelatedAsset) => void;

    constructor(webgl: WebGLRenderingContext) {
        this.webgl = webgl;
        this.renderingManager = new RenderingManager(webgl);

        this.initialize = this.initialize.bind(this);
        this.initializeStandardAssets = this.initializeStandardAssets.bind(this);
        this.beginRender = this.beginRender.bind(this);
        this.getViewport = this.getViewport.bind(this);
        this.getPerspectiveMatrix = this.getPerspectiveMatrix.bind(this);
        this.loadObjectAsset = this.renderingManager.loadObjectAsset;
        this.loadRelatedAsset = this.renderingManager.loadRelatedAsset;
    }

    initialize() {
        this.initializeStandardAssets();
    }

    public beginRender() {
        const viewport = this.getViewport();

        this.webgl.viewport(0, 0, viewport[0], viewport[1]);
        this.webgl.clearColor(0.5, 0.5, 0.5, 1);
        this.webgl.clear(this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT);
    }
    
    public renderObject3(object3: Object3) {
        const viewport = this.getViewport();
        const perspectiveMatrix = this.getPerspectiveMatrix(degreesToRadians(60), 1, 2000);
        const resultMatrix = object3.getMatrix(perspectiveMatrix);

        this.renderingManager.renderObjectAsset(object3.assetKey, viewport, resultMatrix);
    }
    
    public renderObject2(object2: Object2) {
        const viewport = this.getViewport();
        const resultMatrix = object2.getMatrix();

        this.renderingManager.renderRelatedAsset(object2.assetKey, viewport, resultMatrix);
    }

    public getViewport(): Vector2 {
        return [
            this.webgl.canvas.clientWidth, 
            this.webgl.canvas.clientHeight
        ];
    }

    private initializeStandardAssets() {
        this.renderingManager.loadObjectAsset(ImageAsset);
    }

    private getPerspectiveMatrix(fieldOfViewRadians: number, zNear: number, zFar: number) {
        const viewport = this.getViewport();
        const aspect = viewport[0] / viewport[1];
        return matrix4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
    }
}

export default Graphics;
