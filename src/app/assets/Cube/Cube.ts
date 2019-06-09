import * as vertexShaderSource from "./vertexShader.glsl";
import * as fragmentShaderSource from "./fragmentShader.glsl";
import ObjectAsset from "engine/graphics/assets/ObjectAsset";

const asset: ObjectAsset = {
    key: "Cube",
    isDepth: true,
    vertexShaderSource,
    fragmentShaderSource,
    vertex: {
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
        matrixUniformName: "u_matrix",
        positionAttribName: "a_position",
        resolutionUniformName: "u_resolution",
    },
    color: {
        colors: [
            100, 100, 100, 1,
            100, 100, 100, 1,
            100, 100, 100, 1,
            100, 100, 100, 1,
            100, 100, 100, 1,
            100, 100, 100, 1,
            100, 100, 100, 1,
            100, 100, 100, 1,
        ],
        colorAttribName: "a_color",
    },
};

export default asset;
