import BaseAsset from "./BaseAsset";

interface ObjectAsset extends BaseAsset {
    isDepth: boolean;
    vertexShaderSource: string;
    fragmentShaderSource: string;
    vertex: {
        vertices: number[];
        indices: number[];
        positionAttribName: string;
        matrixUniformName: string;
        resolutionUniformName?: string;
    };
    texture?: {    
        texcoords: number[];
        source: string;
        texcoordAttribName: string;
        textureUniformName: string;
    };
    color?: {
        colors: number[];
        colorAttribName?: string;
    };
}

export default ObjectAsset;
