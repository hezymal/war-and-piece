import ObjectAsset from "engine/graphics/assets/ObjectAsset";
import * as vertexShaderSource from "./vertexShader.glsl";
import * as fragmentShaderSource from "./fragmentShader.glsl";
import * as textureSource from "./mock.png";

const asset: ObjectAsset = {
    key: "STD_PACK_IMAGE",
    isDepth: false,
    vertexShaderSource,
    fragmentShaderSource,
    vertex: {
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
        matrixUniformName: "u_matrix",
        positionAttribName: "a_position",
        resolutionUniformName: "u_resolution",
    },
    texture: {
        texcoords: [
            0, 0, 
            1, 0,
            1, 1,
            0, 1,
        ],
        source: textureSource,
        texcoordAttribName: "a_texcoord",
        textureUniformName: "u_texture",
    },
};

export default asset;
