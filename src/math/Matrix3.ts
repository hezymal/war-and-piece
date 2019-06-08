import Vector2 from "./Vector2";

type Matrix3 = number[];

export function identity(): Matrix3 {
    return [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ];
}

export function translation(position: Vector2): Matrix3 {
    return [
        1, 0, 0,
        0, 1, 0,
        position[0], position[1], 1,
    ];
}

export function rotation(angleInRadians: number): Matrix3 {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return [
        c,-s, 0,
        s, c, 0,
        0, 0, 1,
    ];
}

export function scaling(scale: Vector2): Matrix3 {
    return [
        scale[0], 0, 0,
        0, scale[1], 0,
        0, 0, 1,
    ];
}

export function multiply(a: Matrix3, b: Matrix3): Matrix3 {
    var a00 = a[0 * 3 + 0];
    var a01 = a[0 * 3 + 1];
    var a02 = a[0 * 3 + 2];
    var a10 = a[1 * 3 + 0];
    var a11 = a[1 * 3 + 1];
    var a12 = a[1 * 3 + 2];
    var a20 = a[2 * 3 + 0];
    var a21 = a[2 * 3 + 1];
    var a22 = a[2 * 3 + 2];
    var b00 = b[0 * 3 + 0];
    var b01 = b[0 * 3 + 1];
    var b02 = b[0 * 3 + 2];
    var b10 = b[1 * 3 + 0];
    var b11 = b[1 * 3 + 1];
    var b12 = b[1 * 3 + 2];
    var b20 = b[2 * 3 + 0];
    var b21 = b[2 * 3 + 1];
    var b22 = b[2 * 3 + 2];
    return [
        b00 * a00 + b01 * a10 + b02 * a20,
        b00 * a01 + b01 * a11 + b02 * a21,
        b00 * a02 + b01 * a12 + b02 * a22,
        b10 * a00 + b11 * a10 + b12 * a20,
        b10 * a01 + b11 * a11 + b12 * a21,
        b10 * a02 + b11 * a12 + b12 * a22,
        b20 * a00 + b21 * a10 + b22 * a20,
        b20 * a01 + b21 * a11 + b22 * a21,
        b20 * a02 + b21 * a12 + b22 * a22,
    ];
}

export function multiplyMany(...args: Matrix3[]) {
    return args.reduce((acc, matrix) => acc ? multiply(acc, matrix) : matrix);
}

export default Matrix3;
