import Vector3 from "../math/Vector3";
import Matrix4, * as matrix4 from "../math/Matrix4";
import { degreesToRadians } from "../math/angle";

class Object3 {
    public assetKey: string;
    public origin: Vector3 = [0, 0, 0];
    public translation: Vector3 = [0, 0, 0];
    public rotation: Vector3 = [
        degreesToRadians(0), 
        degreesToRadians(0), 
        degreesToRadians(0)
    ];
    public scale: Vector3 = [1, 1, 1];

    constructor(assetKey: string) {
        this.assetKey = assetKey;
        
        this.getMatrix = this.getMatrix.bind(this);
    }

    public getMatrix(identity: Matrix4): Matrix4 {
        return matrix4.multiplyMany(
            identity,
            matrix4.translation(this.translation), 
            matrix4.xRotation(this.rotation[0]),
            matrix4.yRotation(this.rotation[1]),
            matrix4.zRotation(this.rotation[2]),
            matrix4.scaling(this.scale),
            matrix4.translation(this.origin)
        );
    }
}

export default Object3;
