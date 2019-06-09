import Object2 from "./Object2";
import Object3 from "./Object3";
import AssetInfo from "./AssetInfo";
import AssetManager from "./AssetManager";
import Asset from "./Asset";
import * as matrix4 from "engine/math/Matrix4";
import Vector2 from "engine/math/Vector2";

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
        this.renderObject2 = this.renderObject2.bind(this);
        this.loadAsset = this.loadAsset.bind(this);
        this.loadTexture = this.loadTexture.bind(this);
        this.getViewport = this.getViewport.bind(this);
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
        
        const asset: Asset = {
            key: assetInfo.key,
            program,
            positionAttribLocation,
            matrixUniformLocation,
            resolutionUniformLocation,
            positionBuffer,
            indecesCount,
            indexBuffer,
            isTextured: assetInfo.isTextured,
            isColored: assetInfo.isColored,
        };

        if (assetInfo.isTextured) {
            const texcoordAttribLocation = this.webgl.getAttribLocation(program, "a_texcoords");
            const texcoordsBuffer = this.webgl.createBuffer();
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, texcoordsBuffer);
            this.webgl.bufferData(this.webgl.ARRAY_BUFFER, new Float32Array(assetInfo.texcoords), this.webgl.STATIC_DRAW);
            
            const textureUniformLocation = this.webgl.getUniformLocation(program, "u_texture");
            const texture = this.webgl.createTexture();
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, texture);
            this.webgl.texImage2D(this.webgl.TEXTURE_2D, 0, this.webgl.RGBA, 1, 1, 0, this.webgl.RGBA, this.webgl.UNSIGNED_BYTE, new Uint8Array([200, 200, 200, 255]));
            this.loadTexture(texture, assetInfo.textureSource);

            asset.texcoordAttribLocation = texcoordAttribLocation;
            asset.textureUniformLocation = textureUniformLocation;
            asset.texcoordsBuffer = texcoordsBuffer;
            asset.texture = texture;
        }

        if (assetInfo.isColored) {
            const colorAttribLocation = this.webgl.getAttribLocation(program, "a_color");
            const colorBuffer = this.webgl.createBuffer();
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, colorBuffer);
            this.webgl.bufferData(this.webgl.ARRAY_BUFFER, new Uint8Array(assetInfo.colors), this.webgl.STATIC_DRAW);

            asset.colorAttribLocation = colorAttribLocation;
            asset.colorBuffer = colorBuffer;
        }

        this.assetManager.set(asset);
    }

    beginRender() {
        const viewport = this.getViewport();

        this.webgl.viewport(0, 0, viewport[0], viewport[1]);
        this.webgl.clearColor(0.5, 0.5, 0.5, 1);
        this.webgl.clear(this.webgl.COLOR_BUFFER_BIT | this.webgl.DEPTH_BUFFER_BIT);
    }

    renderObject2(object2: Object2) {
        const asset = this.assetManager.get(object2.assetKey);
        const viewport = this.getViewport();

        this.webgl.disable(this.webgl.CULL_FACE);
        this.webgl.disable(this.webgl.DEPTH_TEST);
        this.webgl.useProgram(asset.program);
        this.webgl.uniform2f(asset.resolutionUniformLocation, viewport[0], viewport[1]);
        this.webgl.uniformMatrix3fv(asset.matrixUniformLocation, false, object2.getMatrix());

        this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, asset.positionBuffer);
        this.webgl.vertexAttribPointer(asset.positionAttribLocation, 2, this.webgl.FLOAT, false, 0, 0)
        this.webgl.enableVertexAttribArray(asset.positionAttribLocation);

        if (asset.isTextured) {
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, asset.texcoordsBuffer);
            this.webgl.vertexAttribPointer(asset.texcoordAttribLocation, 2, this.webgl.FLOAT, false, 0, 0);
            this.webgl.enableVertexAttribArray(asset.texcoordAttribLocation);
            
            this.webgl.activeTexture(this.webgl.TEXTURE0);
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, asset.texture);
            this.webgl.uniform1i(asset.textureUniformLocation, 0);
        }

        if (asset.isColored) {
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, asset.colorBuffer);
            this.webgl.vertexAttribPointer(asset.colorAttribLocation, 4, this.webgl.UNSIGNED_BYTE, true, 0, 0);
            this.webgl.enableVertexAttribArray(asset.colorAttribLocation);
        }

        this.webgl.bindBuffer(this.webgl.ELEMENT_ARRAY_BUFFER, asset.indexBuffer);
        this.webgl.drawElements(this.webgl.TRIANGLES, asset.indecesCount, this.webgl.UNSIGNED_SHORT, 0);
    }

    renderObject3(object3: Object3) {
        const asset = this.assetManager.get(object3.assetKey);
        const viewport = this.getViewport();
        const identity = matrix4.projection(viewport[0], viewport[1], 4000);
        
        this.webgl.enable(this.webgl.CULL_FACE);
        this.webgl.enable(this.webgl.DEPTH_TEST);
        this.webgl.useProgram(asset.program);
        
        this.webgl.enableVertexAttribArray(asset.positionAttribLocation);
        this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, asset.positionBuffer);
        this.webgl.vertexAttribPointer(asset.positionAttribLocation, 3, this.webgl.FLOAT, false, 0, 0)
        this.webgl.uniformMatrix4fv(asset.matrixUniformLocation, false, object3.getMatrix(identity));

        if (asset.isTextured) {
            this.webgl.enableVertexAttribArray(asset.texcoordAttribLocation);
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, asset.texcoordsBuffer);
            this.webgl.vertexAttribPointer(asset.texcoordAttribLocation, 2, this.webgl.FLOAT, false, 0, 0);
            
            this.webgl.activeTexture(this.webgl.TEXTURE0);
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, asset.texture);
            this.webgl.uniform1i(asset.textureUniformLocation, 0);
        }

        if (asset.isColored) {
            this.webgl.enableVertexAttribArray(asset.colorAttribLocation);
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, asset.colorBuffer);
            this.webgl.vertexAttribPointer(asset.colorAttribLocation, 4, this.webgl.UNSIGNED_BYTE, true, 0, 0);
        }

        this.webgl.bindBuffer(this.webgl.ELEMENT_ARRAY_BUFFER, asset.indexBuffer);
        this.webgl.drawElements(this.webgl.TRIANGLES, asset.indecesCount, this.webgl.UNSIGNED_SHORT, 0);
    }

    getViewport(): Vector2 {
        return [
            this.webgl.canvas.clientWidth, 
            this.webgl.canvas.clientHeight
        ];
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
