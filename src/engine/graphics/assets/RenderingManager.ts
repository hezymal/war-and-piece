import Vector2 from "engine/math/Vector2";
import Matrix3 from "engine/math/Matrix3";
import ObjectAssetRenderingSchema from "./ObjectAssetRenderingSchema";
import RelatedAssetRenderingSchema from "./RelatedAssetRenderingSchema";
import ObjectAsset from "./ObjectAsset";
import RelatedAsset from "./RelatedAsset";
import AssetRenderingSchema from "./AssetRenderingSchema";

type AssetRenderingSchemaMap = { 
    [key: string]: AssetRenderingSchema
};

class RenderingManager {
    private readonly webgl: WebGLRenderingContext;
    private readonly schemas: AssetRenderingSchemaMap;

    constructor(webgl: WebGLRenderingContext) {
        this.webgl = webgl;
        this.schemas = {};
        
        this.setSchema = this.setSchema.bind(this);
        this.getSchema = this.getSchema.bind(this);
        this.renderObjectAsset = this.renderObjectAsset.bind(this);
        this.renderRelatedAsset = this.renderRelatedAsset.bind(this);
        this.renderObjectSchema = this.renderObjectSchema.bind(this);
        this.loadObjectAsset = this.loadObjectAsset.bind(this);
        this.loadRelatedAsset = this.loadRelatedAsset.bind(this);
        this.loadTexture = this.loadTexture.bind(this);
        this.createShader = this.createShader.bind(this);
        this.createProgram = this.createProgram.bind(this);
        this.createProgramFromSources = this.createProgramFromSources.bind(this);
    }

    public loadObjectAsset(asset: ObjectAsset) {
        const program = this.createProgramFromSources(
            asset.vertexShaderSource, 
            asset.fragmentShaderSource
        );

        const positionAttribLocation = this.webgl.getAttribLocation(program, asset.vertex.positionAttribName);
        const matrixUniformLocation = this.webgl.getUniformLocation(program, asset.vertex.matrixUniformName);
        const resolutionUniformLocation = asset.vertex.resolutionUniformName ? this.webgl.getUniformLocation(program, asset.vertex.resolutionUniformName) : null;
        const positionBuffer = this.webgl.createBuffer();
        this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, positionBuffer);
        this.webgl.bufferData(this.webgl.ARRAY_BUFFER, new Float32Array(asset.vertex.vertices), this.webgl.STATIC_DRAW);
        
        const indecesCount = asset.vertex.indices.length;
        const indexBuffer = this.webgl.createBuffer();
        this.webgl.bindBuffer(this.webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.webgl.bufferData(this.webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(asset.vertex.indices), this.webgl.STATIC_DRAW);
        
        const schema: ObjectAssetRenderingSchema = {
            identifier: "ObjectAssetRenderingSchema",
            key: asset.key,
            isDepth: asset.isDepth,
            program,
            vertex: {
                positionAttribLocation,
                matrixUniformLocation,
                resolutionUniformLocation,
                positionBuffer,
                indecesCount,
                indexBuffer,
            },
        };

        if (asset.texture) {
            const texcoordAttribLocation = this.webgl.getAttribLocation(program, asset.texture.texcoordAttribName);
            const texcoordsBuffer = this.webgl.createBuffer();
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, texcoordsBuffer);
            this.webgl.bufferData(this.webgl.ARRAY_BUFFER, new Float32Array(asset.texture.texcoords), this.webgl.STATIC_DRAW);
            
            const textureUniformLocation = this.webgl.getUniformLocation(program, asset.texture.textureUniformName);
            const texture = this.webgl.createTexture();
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, texture);
            this.webgl.texImage2D(this.webgl.TEXTURE_2D, 0, this.webgl.RGBA, 1, 1, 0, this.webgl.RGBA, this.webgl.UNSIGNED_BYTE, new Uint8Array([200, 200, 200, 255]));
            this.loadTexture(texture, asset.texture.source);

            schema.texture = {
                texture,
                textureUniformLocation,
                texcoordAttribLocation,
                texcoordsBuffer,
            };
        }

        if (asset.color) {
            const colorAttribLocation = this.webgl.getAttribLocation(program, asset.color.colorAttribName);
            const colorBuffer = this.webgl.createBuffer();
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, colorBuffer);
            this.webgl.bufferData(this.webgl.ARRAY_BUFFER, new Uint8Array(asset.color.colors), this.webgl.STATIC_DRAW);

            schema.color = {
                colorAttribLocation,
                colorBuffer,
            };
        }

        this.setSchema(schema);
    }

    public loadRelatedAsset(asset: RelatedAsset) {
        const schema: RelatedAssetRenderingSchema = {
            identifier: "RelatedAssetRenderingSchema",
            key: asset.key,
            relationKey: asset.relationKey,
        };

        if (asset.textureSource) {
            const texture = this.webgl.createTexture();
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, texture);
            this.webgl.texImage2D(this.webgl.TEXTURE_2D, 0, this.webgl.RGBA, 1, 1, 0, this.webgl.RGBA, this.webgl.UNSIGNED_BYTE, new Uint8Array([200, 200, 200, 255]));
            this.loadTexture(texture, asset.textureSource);

            schema.texture = texture;
        }

        this.setSchema(schema);
    }

    public renderObjectAsset(assetKey: string, viewport: Vector2, matrix: Matrix3) {
        const schema = this.getSchema(assetKey) as ObjectAssetRenderingSchema;

        this.renderObjectSchema(schema, viewport, matrix);
    }

    public renderRelatedAsset(assetKey: string, viewport: Vector2, matrix: Matrix3) {
        const relatedShema = this.getSchema(assetKey) as RelatedAssetRenderingSchema;
        const schema = this.getSchema(relatedShema.relationKey) as ObjectAssetRenderingSchema;
        const finalSchema: ObjectAssetRenderingSchema = {
            ...schema,
            texture: {
                ...schema.texture,
                texture: relatedShema.texture,
            },
        };

        this.renderObjectSchema(finalSchema, viewport, matrix);
    }

    private renderObjectSchema(schema: ObjectAssetRenderingSchema, viewport: Vector2, matrix: Matrix3) {
        if (schema.isDepth) {
            this.webgl.enable(this.webgl.CULL_FACE);
            this.webgl.enable(this.webgl.DEPTH_TEST);
        } else {
            this.webgl.disable(this.webgl.CULL_FACE);
            this.webgl.disable(this.webgl.DEPTH_TEST);
        }

        this.webgl.useProgram(schema.program);
        
        if (schema.vertex.resolutionUniformLocation) {
            this.webgl.uniform2f(schema.vertex.resolutionUniformLocation, viewport[0], viewport[1]);
        }
        
        if (schema.isDepth) {
            this.webgl.uniformMatrix4fv(schema.vertex.matrixUniformLocation, false, matrix);
        } else {
            this.webgl.uniformMatrix3fv(schema.vertex.matrixUniformLocation, false, matrix);
        }

        this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, schema.vertex.positionBuffer);
        this.webgl.enableVertexAttribArray(schema.vertex.positionAttribLocation);
        if (schema.isDepth) {
            this.webgl.vertexAttribPointer(schema.vertex.positionAttribLocation, 3, this.webgl.FLOAT, false, 0, 0)
        } else {
            this.webgl.vertexAttribPointer(schema.vertex.positionAttribLocation, 2, this.webgl.FLOAT, false, 0, 0)
        }

        if (schema.texture) {
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, schema.texture.texcoordsBuffer);
            this.webgl.vertexAttribPointer(schema.texture.texcoordAttribLocation, 2, this.webgl.FLOAT, false, 0, 0);
            this.webgl.enableVertexAttribArray(schema.texture.texcoordAttribLocation);
            
            this.webgl.activeTexture(this.webgl.TEXTURE0);
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, schema.texture.texture);
            this.webgl.uniform1i(schema.texture.textureUniformLocation, 0);
        }

        if (schema.color) {
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, schema.color.colorBuffer);
            this.webgl.vertexAttribPointer(schema.color.colorAttribLocation, 4, this.webgl.UNSIGNED_BYTE, true, 0, 0);
            this.webgl.enableVertexAttribArray(schema.color.colorAttribLocation);
        }

        this.webgl.bindBuffer(this.webgl.ELEMENT_ARRAY_BUFFER, schema.vertex.indexBuffer);
        this.webgl.drawElements(this.webgl.TRIANGLES, schema.vertex.indecesCount, this.webgl.UNSIGNED_SHORT, 0);
    }

    private getSchema(assetKey: string) {
        return this.schemas[assetKey];
    }

    private setSchema(asset: AssetRenderingSchema) {
        this.schemas[asset.key] = asset;
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
        const vertexShader = this.createShader(this.webgl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.webgl.FRAGMENT_SHADER, fragmentShaderSource);
        return this.createProgram(vertexShader, fragmentShader);
    }
}

export default RenderingManager;
