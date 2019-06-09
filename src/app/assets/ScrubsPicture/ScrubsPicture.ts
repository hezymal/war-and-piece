import * as vertexShaderSource from "./vertexShader.glsl";
import * as fragmentShaderSource from "./fragmentShader.glsl";
import * as textureSource from "./texture.jpg";
import AssetInfo from "../../../engine/graphics/AssetInfo";

const assetInfo: AssetInfo = {
    key: "ScrubsPicture",
    is3D: false,
    vertices: [
        0, 0,
        100, 0,
        100, 100,
        0, 100,
    ],
    indices: [
        0, 1, 2, 
        2, 3, 0
    ],
    vertexShaderSource,
    fragmentShaderSource,

    isTextured: true,
    texcoords: [
        0, 0, 
        1, 0,
        1, 1,
        0, 1,
    ],
    textureSource,

    isColored: false,
};

export default assetInfo;
