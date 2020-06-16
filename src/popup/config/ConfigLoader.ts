import { IConfiguration, IFeature } from "./Schema";

const COMPATIBLE_VERSION = "1";

export default class ConfigLoader {
    public loaded?: (config: IConfiguration) => void;
    public failedFetch?: (reason: any) => void;
    public incompatible?: (extVer: string, configVer: string) => void;

    public async loadConfig(): Promise<void> {
        // first execute load callback from local storage config
        let config: IConfiguration = await this._getConfigFromChromeStorage();
        if (config && config.version.split(".")[0] !== COMPATIBLE_VERSION) {
            if (this.incompatible) {
                this.incompatible(COMPATIBLE_VERSION, config.version);
            }
        } else if (config && this.loaded) {
            this.loaded(config);
        }

        // then check remote config
        try {
            let remoteConfig: IConfiguration = await this._getConfigFromRemote();
            if (config && config.version === remoteConfig.version) {
                // same version, do nothing
            } else if (remoteConfig.version.split(".")[0] !== COMPATIBLE_VERSION) {
                if (this.incompatible) {
                    this.incompatible(COMPATIBLE_VERSION, remoteConfig.version);
                }
                // remote config is incompatible so keep local config
            } else {
                this._storeConfig(remoteConfig);
                if (this.loaded) {
                    this.loaded(remoteConfig);
                }
            }
        } catch (ex) {
            if (this.failedFetch) {
                this.failedFetch(ex);
            }
        }
    }

    public loadFeatures(source: string, prefix?: string): Promise<IFeature[]> {
        return fetch(source).then(response => response.text()).then(text => {
            const matches = text.match(/(?:\n\s*)(\w*?):/g);
            return matches ? matches.map(match => (match.match(/\w+/) || [])[0]).map(feature => ({
                label: feature,
                name: `${prefix || ""}${feature}`,
                options: ["true", "false"]
            })) : [];
        });
    }

    public getConfigEndpoint(): Promise<string> {
        return new Promise((resolve, reject) => chrome.storage.sync.get("configEndpoint", result => {
            resolve(result.configEndpoint || "https://gist.github.com/PxlBuzzard/f055b8043c5972befc37b32f4d25feb2/raw/azureportaldevextensionconfig.json");
        }));
    }

    public setConfigEndpoint(endpoint: string): Promise<void> {
        return new Promise((resolve, reject) => chrome.storage.sync.set({
            configEndpoint: endpoint
        }, resolve));
    }

    private _getConfigFromChromeStorage(): Promise<IConfiguration> {
        return new Promise((resolve, reject) => chrome.storage.sync.get("config", result => {
            resolve(result.config && JSON.parse(result.config) || null);
        }));
    }

    private async _getConfigFromRemote(): Promise<IConfiguration> {
        let endpoint = await this.getConfigEndpoint();
        return fetch(endpoint).then(response => response.json());
    }

    private _storeConfig(config: IConfiguration): Promise<void> {
        return new Promise((resolve, reject) => chrome.storage.sync.set({
            config: JSON.stringify(config)
        }, resolve));
    }
}
