import BaseAsset from "./BaseAsset";

interface RelatedAsset extends BaseAsset {
    relationKey: string;
    textureSource: string;
}

export default RelatedAsset;
