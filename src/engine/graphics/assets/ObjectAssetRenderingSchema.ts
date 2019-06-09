import AssetRenderingSchema from "./AssetRenderingSchema";

interface ObjectAssetRenderingSchema extends AssetRenderingSchema {
    identifier: "ObjectAssetRenderingSchema";
    isDepth: boolean;
    program: WebGLProgram;
    vertex: {
        resolutionUniformLocation: WebGLUniformLocation | null;
        matrixUniformLocation: WebGLUniformLocation;
        positionAttribLocation: number;
        positionBuffer: WebGLBuffer;
        indexBuffer: WebGLBuffer;
        indecesCount: number;
    };
    texture?: {
        textureUniformLocation: WebGLUniformLocation;
        texcoordAttribLocation: number;
        texcoordsBuffer: WebGLBuffer;
        texture: WebGLTexture;
    };
    color?: {
        colorBuffer: WebGLBuffer;
        colorAttribLocation: number;
    };
}

export default ObjectAssetRenderingSchema;
