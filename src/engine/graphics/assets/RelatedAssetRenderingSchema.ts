import AssetRenderingSchema from "./AssetRenderingSchema";

interface RelatedAssetRenderingSchema extends AssetRenderingSchema {
    identifier: "RelatedAssetRenderingSchema";
    relationKey: string;
    texture?: WebGLTexture;
}

export default RelatedAssetRenderingSchema;
