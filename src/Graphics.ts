import Object3D from "./Object3D";

class Graphics {
    private webgl: WebGLRenderingContext;

    constructor(webgl: WebGLRenderingContext) {
        this.webgl = webgl;

        this.createShader = this.createShader.bind(this);
        this.createVertexShader = this.createVertexShader.bind(this);
        this.createShader = this.createShader.bind(this);
        this.createProgram = this.createProgram.bind(this);
        this.createProgramFromSources = this.createProgramFromSources.bind(this);
        this.createObject3D = this.createObject3D.bind(this);
        this.render = this.render.bind(this);
        this.renderObject3D = this.renderObject3D.bind(this);
        this.loadTexture = this.loadTexture.bind(this);
    }

    createObject3D(vertices: number[], indices: number[], texcoords: number[], vertexShaderSource: string, fragmentShaderSource: string) {
        const object3D = new Object3D();
        
        object3D.program = this.createProgramFromSources(vertexShaderSource, fragmentShaderSource);
        
        object3D.positionAttribLocation = this.webgl.getAttribLocation(object3D.program, "a_position");
        object3D.matrixUniformLocation = this.webgl.getUniformLocation(object3D.program, "u_matrix");
        object3D.resolutionUniformLocation = this.webgl.getUniformLocation(object3D.program, "u_resolution");
        object3D.positionBuffer = this.webgl.createBuffer();
        this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, object3D.positionBuffer);
        this.webgl.bufferData(this.webgl.ARRAY_BUFFER, new Float32Array(vertices), this.webgl.STATIC_DRAW);
        
        object3D.indecesCount = indices.length;
        object3D.indexBuffer = this.webgl.createBuffer();
        this.webgl.bindBuffer(this.webgl.ELEMENT_ARRAY_BUFFER, object3D.indexBuffer);
        this.webgl.bufferData(this.webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.webgl.STATIC_DRAW);
        
        object3D.texcoordAttribLocation = this.webgl.getAttribLocation(object3D.program, "a_texcoords");
        object3D.texcoordsBuffer = this.webgl.createBuffer();
        this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, object3D.texcoordsBuffer);
        this.webgl.bufferData(this.webgl.ARRAY_BUFFER, new Float32Array(texcoords), this.webgl.STATIC_DRAW);
        
        object3D.textureUniformLocation = this.webgl.getUniformLocation(object3D.program, 'u_texture');
        object3D.texture = this.webgl.createTexture();
        this.webgl.bindTexture(this.webgl.TEXTURE_2D, object3D.texture);
        this.webgl.texImage2D(this.webgl.TEXTURE_2D, 0, this.webgl.RGBA, 1, 1, 0, this.webgl.RGBA, this.webgl.UNSIGNED_BYTE, new Uint8Array([200, 200, 200, 255]));

        return object3D;
    }

    loadTexture(object3D: Object3D, imageSrc: string) {
        var image = new Image();
        image.addEventListener("load", () => {
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, object3D.texture);
            this.webgl.texImage2D(this.webgl.TEXTURE_2D, 0, this.webgl.RGBA, this.webgl.RGBA, this.webgl.UNSIGNED_BYTE, image);
            this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
            this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR_MIPMAP_NEAREST);
            this.webgl.generateMipmap(this.webgl.TEXTURE_2D);
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, null);
        });
        image.src = imageSrc;
    }

    render(objects: Object3D[]) {
        this.webgl.viewport(0, 0, this.webgl.canvas.width, this.webgl.canvas.height);
        this.webgl.clearColor(0.5, 0.5, 0.5, 1);
        this.webgl.clear(this.webgl.COLOR_BUFFER_BIT);

        for (const object3D of objects) {
            this.renderObject3D(object3D);
        }
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

    private renderObject3D(object3D: Object3D) {
        this.webgl.useProgram(object3D.program);
        
        this.webgl.enableVertexAttribArray(object3D.positionAttribLocation);
        this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, object3D.positionBuffer);
        this.webgl.vertexAttribPointer(object3D.positionAttribLocation, 2, this.webgl.FLOAT, false, 0, 0)
        this.webgl.uniform2f(object3D.resolutionUniformLocation, this.webgl.canvas.width, this.webgl.canvas.height);
        this.webgl.uniformMatrix3fv(object3D.matrixUniformLocation, false, object3D.getMatrix());

        this.webgl.enableVertexAttribArray(object3D.texcoordAttribLocation);
        this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, object3D.texcoordsBuffer);
        this.webgl.vertexAttribPointer(object3D.texcoordAttribLocation, 2, this.webgl.FLOAT, false, 0, 0);
        
        this.webgl.activeTexture(this.webgl.TEXTURE0);
        this.webgl.bindTexture(this.webgl.TEXTURE_2D, object3D.texture);
        this.webgl.uniform1i(object3D.textureUniformLocation, 0);

        this.webgl.bindBuffer(this.webgl.ELEMENT_ARRAY_BUFFER, object3D.indexBuffer);
        this.webgl.drawElements(this.webgl.TRIANGLES, object3D.indecesCount, this.webgl.UNSIGNED_SHORT, 0);
    }
}

export default Graphics;
