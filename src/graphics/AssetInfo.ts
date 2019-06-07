interface AssetInfo {
    key: string;
    vertices: number[];
    indices: number[];
    texcoords: number[];
    vertexShaderSource: string;
    fragmentShaderSource: string;
    textureSource: string;
}

export default AssetInfo;
