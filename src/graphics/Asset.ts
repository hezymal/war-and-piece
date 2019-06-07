interface Asset {
    key: string;
    program: WebGLProgram;
    resolutionUniformLocation: WebGLUniformLocation;
    matrixUniformLocation: WebGLUniformLocation;
    textureUniformLocation: WebGLUniformLocation;
    positionAttribLocation: number;
    texcoordAttribLocation: number;
    positionBuffer: WebGLBuffer;
    indexBuffer: WebGLBuffer;
    texcoordsBuffer: WebGLBuffer;
    texture: WebGLTexture;
    indecesCount: number;
}

export default Asset;
