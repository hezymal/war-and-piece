import Vector3 from "engine/math/Vector3";
import Matrix4, * as matrix4 from "engine/math/Matrix4";

class Camera {
    public translation: Vector3 = [0, 0, 0];
    public rotation: Vector3 = [0, 0, 0];

    constructor() {
        this.getMatrix = this.getMatrix.bind(this);
    }

    public getMatrix(): Matrix4 {
        return matrix4.inverse(
            matrix4.multiplyMany(
                matrix4.translation(this.translation), 
                matrix4.xRotation(this.rotation[0]),
                matrix4.yRotation(this.rotation[1]),
                matrix4.zRotation(this.rotation[2])
            )
        );
    }
}

export default Camera;