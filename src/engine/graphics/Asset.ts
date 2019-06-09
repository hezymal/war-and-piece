interface Asset {
    key: string;
    program: WebGLProgram;
    
    resolutionUniformLocation: WebGLUniformLocation;
    matrixUniformLocation: WebGLUniformLocation;
    positionAttribLocation: number;
    positionBuffer: WebGLBuffer;
    indexBuffer: WebGLBuffer;
    indecesCount: number;

    isTextured: boolean;
    textureUniformLocation?: WebGLUniformLocation;
    texcoordAttribLocation?: number;
    texcoordsBuffer?: WebGLBuffer;
    texture?: WebGLTexture;

    isColored: boolean;
    colorBuffer?: WebGLBuffer;
    colorAttribLocation?: number;
}

export default Asset;
