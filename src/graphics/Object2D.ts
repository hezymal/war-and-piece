import Vector2 from "../math/Vector2";
import Matrix3, * as matrix3 from "../math/Matrix3";
import { degreesToRadians } from "../math/angle";

class Object2D {
    public assetKey: string;
    public origin: Vector2 = [0, 0];
    public translation: Vector2 = [0, 0];
    public angleInDegrees: number = 0;
    public scale: Vector2 = [1, 1];

    constructor(assetKey: string) {
        this.assetKey = assetKey;
        
        this.getMatrix = this.getMatrix.bind(this);
    }

    public getMatrix(): Matrix3 {
        return matrix3.multiplyMany(
            matrix3.translation(this.translation), 
            matrix3.rotation(degreesToRadians(this.angleInDegrees)),
            matrix3.scaling(this.scale),
            matrix3.translation(this.origin)
        );
    }
}

export default Object2D;
