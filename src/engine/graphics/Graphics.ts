import Vector2 from "engine/math/Vector2";
import Matrix4, * as matrix4 from "engine/math/Matrix4";
import { degreesToRadians } from "engine/math/angle";
import RenderingManager from "./assets/RenderingManager";
import ObjectAsset from "./assets/ObjectAsset";
import RelatedAsset from "./assets/RelatedAsset";
import Object3 from "./Object3";
import Object2 from "./Object2";
import ImageAsset from "./standardAssets/Image";
import Camera from "./Camera";

class Graphics {
    private readonly webgl: WebGLRenderingContext;
    private readonly renderingManager: RenderingManager;
    
    private currentCamera: Camera;
    private fieldOfView: number;

    public readonly loadObjectAsset: (asset: ObjectAsset) => void;
    public readonly loadRelatedAsset: (asset: RelatedAsset) => void;

    constructor(webgl: WebGLRenderingContext, renderingManager: RenderingManager) {
        this.webgl = webgl;
        this.renderingManager = renderingManager;

        this.initialize = this.initialize.bind(this);
        this.beginRender = this.beginRender.bind(this);
        this.getViewport = this.getViewport.bind(this);
        this.getPerspectiveMatrix = this.getPerspectiveMatrix.bind(this);
        this.getViewProjectionMatrix = this.getViewProjectionMatrix.bind(this);
        this.setCurrentCamera = this.setCurrentCamera.bind(this);
        this.setFieldOfView = this.setFieldOfView.bind(this);
        this.loadObjectAsset = this.renderingManager.loadObjectAsset;
        this.loadRelatedAsset = this.renderingManager.loadRelatedAsset;
    }

    initialize() {
        this.renderingManager.loadObjectAsset(ImageAsset);
        this.fieldOfView = degreesToRadians(45);
    }

    public beginRender() {
        const viewport = this.getViewport();

        this.webgl.viewport(0, 0, viewport[0], viewport[1]);
        this.webgl.clearColor(0.5, 0.5, 0.5, 1);
        this.webgl.clear(this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT);
    }
    
    public renderObject3(object3: Object3) {
        const viewport = this.getViewport();
        const viewProjMatrix = this.getViewProjectionMatrix();
        const resultMatrix = matrix4.multiply(viewProjMatrix, object3.getMatrix());

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

    public getViewProjectionMatrix(): Matrix4 {
        const viewport = this.getViewport();
        const projMatrix = this.getPerspectiveMatrix(viewport, 1, 2000);
        const viewMatrix = this.currentCamera ? this.currentCamera.getMatrix() : matrix4.identity();
        return matrix4.multiply(projMatrix, viewMatrix);
    }

    public setCurrentCamera(camera: Camera) {
        this.currentCamera = camera;
    }

    public setFieldOfView(fieldOfView: number) {
        this.fieldOfView = fieldOfView;
    }

    private getPerspectiveMatrix(viewport: Vector2, zNear: number, zFar: number) {
        const aspect = viewport[0] / viewport[1];
        return matrix4.perspective(this.fieldOfView, aspect, zNear, zFar);
    }

    public static factory(canvas: HTMLCanvasElement): Graphics {
        const webgl = canvas.getContext("webgl");
        const renderingManager = new RenderingManager(webgl);
        return new Graphics(webgl, renderingManager);
    }
}

export default Graphics;
