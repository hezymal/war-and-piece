import * as vertexShaderSource from "./vertexShader.glsl";
import * as fragmentShaderSource from "./fragmentShader.glsl";
import * as textureSource from "./texture.jpg";
import AssetInfo from "../AssetInfo";

const assetInfo: AssetInfo = {
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
    texcoords: [
        0, 0, 
        1, 0,
        1, 1,
        0, 1,
    ],
    vertexShaderSource,
    fragmentShaderSource,
    textureSource,
};

export default assetInfo;
