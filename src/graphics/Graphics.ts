import Object2D from "./Object2D";
import AssetInfo from "./AssetInfo";
import AssetManager from "./AssetManager";
import Asset from "./Asset";

class Graphics {
    private webgl: WebGLRenderingContext;
    private assetManager: AssetManager;

    constructor(webgl: WebGLRenderingContext) {
        this.webgl = webgl;
        this.assetManager = new AssetManager();

        this.createShader = this.createShader.bind(this);
        this.createVertexShader = this.createVertexShader.bind(this);
        this.createShader = this.createShader.bind(this);
        this.createProgram = this.createProgram.bind(this);
        this.createProgramFromSources = this.createProgramFromSources.bind(this);
        this.beginRender = this.beginRender.bind(this);
        this.renderObject2D = this.renderObject2D.bind(this);
        this.loadAsset = this.loadAsset.bind(this);
        this.loadTexture = this.loadTexture.bind(this);
    }

    loadAsset(assetInfo: AssetInfo) {
        const program = this.createProgramFromSources(
            assetInfo.vertexShaderSource, 
            assetInfo.fragmentShaderSource
        );
        
        const positionAttribLocation = this.webgl.getAttribLocation(program, "a_position");
        const matrixUniformLocation = this.webgl.getUniformLocation(program, "u_matrix");
        const resolutionUniformLocation = this.webgl.getUniformLocation(program, "u_resolution");
        const positionBuffer = this.webgl.createBuffer();
        this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, positionBuffer);
        this.webgl.bufferData(this.webgl.ARRAY_BUFFER, new Float32Array(assetInfo.vertices), this.webgl.STATIC_DRAW);
        
        const indecesCount = assetInfo.indices.length;
        const indexBuffer = this.webgl.createBuffer();
        this.webgl.bindBuffer(this.webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.webgl.bufferData(this.webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(assetInfo.indices), this.webgl.STATIC_DRAW);
        
        const texcoordAttribLocation = this.webgl.getAttribLocation(program, "a_texcoords");
        const texcoordsBuffer = this.webgl.createBuffer();
        this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, texcoordsBuffer);
        this.webgl.bufferData(this.webgl.ARRAY_BUFFER, new Float32Array(assetInfo.texcoords), this.webgl.STATIC_DRAW);
        
        const textureUniformLocation = this.webgl.getUniformLocation(program, 'u_texture');
        const texture = this.webgl.createTexture();
        this.webgl.bindTexture(this.webgl.TEXTURE_2D, texture);
        this.webgl.texImage2D(this.webgl.TEXTURE_2D, 0, this.webgl.RGBA, 1, 1, 0, this.webgl.RGBA, this.webgl.UNSIGNED_BYTE, new Uint8Array([200, 200, 200, 255]));
        this.loadTexture(texture, assetInfo.textureSource);

        this.assetManager.set({
            key: assetInfo.key,
            program,
            positionAttribLocation,
            matrixUniformLocation,
            resolutionUniformLocation,
            positionBuffer,
            indecesCount,
            indexBuffer,
            texcoordAttribLocation,
            texcoordsBuffer,
            textureUniformLocation,
            texture,
        });
    }

    beginRender() {
        this.webgl.viewport(0, 0, this.webgl.canvas.width, this.webgl.canvas.height);
        this.webgl.clearColor(0.5, 0.5, 0.5, 1);
        this.webgl.clear(this.webgl.COLOR_BUFFER_BIT);
    }

    renderObject2D(object2D: Object2D) {
        const asset = this.assetManager.get(object2D.assetKey);

        this.webgl.useProgram(asset.program);
        
        this.webgl.enableVertexAttribArray(asset.positionAttribLocation);
        this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, asset.positionBuffer);
        this.webgl.vertexAttribPointer(asset.positionAttribLocation, 2, this.webgl.FLOAT, false, 0, 0)
        this.webgl.uniform2f(asset.resolutionUniformLocation, this.webgl.canvas.width, this.webgl.canvas.height);
        this.webgl.uniformMatrix3fv(asset.matrixUniformLocation, false, object2D.getMatrix());

        this.webgl.enableVertexAttribArray(asset.texcoordAttribLocation);
        this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, asset.texcoordsBuffer);
        this.webgl.vertexAttribPointer(asset.texcoordAttribLocation, 2, this.webgl.FLOAT, false, 0, 0);
        
        this.webgl.activeTexture(this.webgl.TEXTURE0);
        this.webgl.bindTexture(this.webgl.TEXTURE_2D, asset.texture);
        this.webgl.uniform1i(asset.textureUniformLocation, 0);

        this.webgl.bindBuffer(this.webgl.ELEMENT_ARRAY_BUFFER, asset.indexBuffer);
        this.webgl.drawElements(this.webgl.TRIANGLES, asset.indecesCount, this.webgl.UNSIGNED_SHORT, 0);
    }

    private createShader(type: number, source: string) {
        const shader = this.webgl.createShader(type);
        this.webgl.shaderSource(shader, source);
        this.webgl.compileShader(shader);
        
        const success = this.webgl.getShaderParameter(shader, this.webgl.COMPILE_STATUS);
        if (!success) {
            const errorLog = this.webgl.getShaderInfoLog(shader);
            this.webgl.deleteShader(shader);

            throw new Error(`Error creating shader: ${errorLog}`);
        }

        return shader;
    }

    private createVertexShader(source: string) {
        return this.createShader(this.webgl.VERTEX_SHADER, source);
    }

    private createFragmentShader(source: string) {
        return this.createShader(this.webgl.FRAGMENT_SHADER, source);
    }
    
    private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        const program = this.webgl.createProgram();
        this.webgl.attachShader(program, vertexShader);
        this.webgl.attachShader(program, fragmentShader);
        this.webgl.linkProgram(program);
        
        const success = this.webgl.getProgramParameter(program, this.webgl.LINK_STATUS);
        if (!success) {
            const errorLog = this.webgl.getProgramInfoLog(program);
            this.webgl.deleteProgram(program);

            throw new Error(`Error creating shaders program: ${errorLog}`);
        }

        return program;
    }

    private createProgramFromSources(vertexShaderSource: string, fragmentShaderSource: string) {        
        const vertexShader = this.createVertexShader(vertexShaderSource);
        const fragmentShader = this.createFragmentShader(fragmentShaderSource);
        return this.createProgram(vertexShader, fragmentShader);
    }

    private loadTexture(texture: WebGLTexture, imageSource: string) {
        var image = new Image();
        image.addEventListener("load", () => {
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, texture);
            this.webgl.texImage2D(this.webgl.TEXTURE_2D, 0, this.webgl.RGBA, this.webgl.RGBA, this.webgl.UNSIGNED_BYTE, image);
            this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
            this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR_MIPMAP_NEAREST);
            this.webgl.generateMipmap(this.webgl.TEXTURE_2D);
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, null);
        });
        image.src = imageSource;
    }
}

export default Graphics;