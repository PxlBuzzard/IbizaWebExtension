import { IConfiguration } from "./Schema";

export class ConfigLoader {
    public getConfigFromChromeStorage(): Promise<IConfiguration> {
        return new Promise((resolve, reject) => chrome.storage.sync.get("config", result => {
            if (result.config) {
                resolve(JSON.parse(result.config));
            } else {
                reject("config not found in chrome storage");
            }
        }));
    }

    public async getConfigFromRemote(): Promise<any> {
        let endpoint = await this._getConfigEndpoint();
        return fetch(endpoint).then(response => response.json());
    }

    private _getConfigEndpoint(): Promise<string> {
        return new Promise((resolve, reject) => chrome.storage.sync.get("configEndpoint", result => {
            resolve(result.configEndpoint || "./config/config.json");
        }));
    }
}