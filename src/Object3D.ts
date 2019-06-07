import Vector2 from "./math/Vector2";
import Matrix3, * as matrix3 from "./math/Matrix3";
import * as angle from "./math/angle";

class Object3D {
    public program: WebGLProgram;
    public resolutionUniformLocation: WebGLUniformLocation;
    public matrixUniformLocation: WebGLUniformLocation;
    public textureUniformLocation: WebGLUniformLocation;
    public positionAttribLocation: number;
    public texcoordAttribLocation: number;
    public positionBuffer: WebGLBuffer;
    public indexBuffer: WebGLBuffer;
    public texcoordsBuffer: WebGLBuffer;
    public texture: WebGLTexture;
    public indecesCount: number;

    public origin: Vector2 = [0, 0];
    public translation: Vector2 = [0, 0];
    public angleInDegrees: number = 0;
    public scale: Vector2 = [1, 1];

    constructor() {
        this.getMatrix = this.getMatrix.bind(this);
    }

    public getMatrix(): Matrix3 {
        return matrix3.multiplyMany(
            matrix3.translation(this.translation), 
            matrix3.rotation(angle.degreesToRadians(this.angleInDegrees)),
            matrix3.scaling(this.scale),
            matrix3.translation(this.origin)
        );
    }
}

export default Object3D;
