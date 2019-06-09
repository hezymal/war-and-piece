interface AssetInfo {
    key: string;
    is3D: boolean;
    vertices: number[];
    indices: number[];
    vertexShaderSource: string;
    fragmentShaderSource: string;
    
    isTextured: boolean;
    texcoords?: number[];
    textureSource?: string;
    
    isColored: boolean;
    colors?: number[];
}

export default AssetInfo;
