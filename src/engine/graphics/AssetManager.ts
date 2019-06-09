import Asset from "./Asset";

class AssetManager {
    private assets: { [key: string]: Asset };

    constructor() {
        this.assets = {};
        
        this.set = this.set.bind(this);
        this.get = this.get.bind(this);
        this.has = this.has.bind(this);
    }

    public set(asset: Asset) {
        this.assets[asset.key] = asset;
    }

    public get(key: string) {
        return this.assets[key];
    }

    public has(key: string) {
        return !!this.assets[key];
    }
}

export default AssetManager;
