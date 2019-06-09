import * as vertexShaderSource from "./vertexShader.glsl";
import * as fragmentShaderSource from "./fragmentShader.glsl";
import AssetInfo from "../../../engine/graphics/AssetInfo";

const assetInfo: AssetInfo = {
    key: "Cube",
    is3D: true,
    isTextured: false,
    isColored: true,
    vertices: [
        // top
        0, 0, 0,
        100, 0, 0,
        100, 0, 100,
        0, 0, 100,
        // bottom
        0, 100, 0,
        100, 100, 0,
        100, 100, 100,
        0, 100, 100,
    ],
    indices: [
        // front
        0, 1, 5, 5, 4, 0,
        // left
        1, 2, 6, 6, 5, 1,
        // back
        2, 3, 7, 7, 6, 2,
        // right
        0, 4, 7, 7, 3, 0,
        // top
        3, 2, 1, 1, 0, 3,
        // bottom
        5, 6, 7, 7, 4, 5,
    ],
    colors: [
        255, 0, 0, 255,
        255, 255, 0, 255,
        255, 0, 255, 255,
        0, 255, 0, 255,
        0, 255, 255, 255,
        128, 128, 0, 255,
        255, 0, 128, 255,
        255, 128, 0, 255,
    ],
    vertexShaderSource,
    fragmentShaderSource,
};

export default assetInfo;
