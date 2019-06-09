import * as imageSource from "./texture.jpg";
import RelatedAsset from "engine/graphics/assets/RelatedAsset";
import ImageAsset from "engine/graphics/standardAssets/Image";

const asset: RelatedAsset = {
    key: "ScrubsPicture",
    relationKey: ImageAsset.key,
    textureSource: imageSource,
};

export default asset;
