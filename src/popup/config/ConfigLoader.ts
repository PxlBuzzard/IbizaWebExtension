import { IConfigFile, IFeature } from "./Schema";

const COMPATIBLE_VERSION = "3";

export default class ConfigLoader {
  public loaded?: (config: IConfigFile) => void;
  public failedFetch?: (reason: any) => void;
  public incompatible?: (extVer: string, configVer: string) => void;

  public async loadConfig(): Promise<void> {
    // first execute load callback from local storage config
    // const config: IConfigFile = {
    //   version: "0",
    //   help: "",
    //   changelog: [],
    //   configs: []
    // };

    try {
      const localConfig = await this._getConfigFromChromeStorage();
      if (localConfig.version.split(".")[0] !== COMPATIBLE_VERSION) {
        if (this.incompatible) {
          this.incompatible(COMPATIBLE_VERSION, localConfig.version);
        } else {
          throw new Error("Incompatible config version");
        }
      } else if (localConfig && this.loaded) {
        console.log("Successfully loaded config from Chrome storage");
        this.loaded(localConfig);
      }
    } catch (ex) {
      console.error(ex);
      console.log("Trying to load config from remote");
    }

    // then check remote config
    try {
      const remoteConfig = await this._getConfigFromRemote();
      // same version, do nothing
      // if (config?.version === remoteConfig.version) {
      //   console.log("Remote config version is the same as local");
      // }
      // remote config is a major breaking change
      // do not download, a web extension update will contain a new working config
      if (remoteConfig.version.split(".")[0] !== COMPATIBLE_VERSION) {
        if (this.incompatible) {
          this.incompatible(COMPATIBLE_VERSION, remoteConfig.version);
        }
      }
      // remote config is a minor update, save it
      else {
        console.log(remoteConfig);
        await this._storeConfig(remoteConfig);
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

  public async loadFeatures(source: string, prefix?: string): Promise<IFeature[]> {
    const text = await fetch(source).then((response) => response.text());
    const matches = text.match(/(?:\n\s*)(\w*?):/g);
    return matches
      ? matches
          .map((match) => (match.match(/\w+/) || [])[0])
          .map((feature) => ({
            label: feature,
            name: `${prefix || ""}${feature}`,
            options: ["true", "false"],
          }))
      : [];
  }

  public getConfigEndpoint(): Promise<string> {
    return new Promise((resolve) =>
      chrome.storage.sync.get("configEndpoint", (result) => {
        const configUrl =
          result.configEndpoint ||
          "https://gist.github.com/PxlBuzzard/f055b8043c5972befc37b32f4d25feb2/raw/azureportaldevextensionconfig.json";
        console.log(`Getting config from ${configUrl}`);
        resolve(configUrl);
      }),
    );
  }

  public setConfigEndpoint(endpoint: string): Promise<void> {
    return new Promise((resolve) =>
      chrome.storage.sync.set(
        {
          configEndpoint: endpoint,
        },
        resolve,
      ),
    );
  }

  private _getConfigFromChromeStorage(): Promise<IConfigFile> {
    return this._chunkedRead("config");
  }

  private async _getConfigFromRemote(): Promise<IConfigFile> {
    const endpoint = await this.getConfigEndpoint();
    return fetch(endpoint).then((response) => response.json());
  }

  private _storeConfig(config: IConfigFile): Promise<void> {
    return this._chunkedWrite("config", config);
  }

  // taken from https://stackoverflow.com/questions/67353979/algorithm-to-break-down-item-for-chrome-storage-sync/67429150#67429150
  private _chunkedWrite(key: string, value: IConfigFile): Promise<void> {
    return new Promise((resolve) => {
      if (typeof key !== "string") key = `${key}`;
      const str = JSON.stringify(value);
      const len = chrome.storage.sync.QUOTA_BYTES_PER_ITEM - key.length - 1000;
      const num = Math.ceil(str.length / len);
      const obj: any = {};
      obj[key + "#"] = num;
      for (let i = 0; i < num; i++) {
        obj[key + i] = str.substr(i * len, len);
      }
      console.log(`Splitting config file into ${num} parts`);
      console.log(obj);
      return chrome.storage.sync.set(obj, () => {
        if (chrome.runtime.lastError) {
          console.error(`Failed to save config`);
          throw new Error(chrome.runtime.lastError.message);
        } else {
          console.log("Config saved");
        }

        return resolve();
      });
    });
  }

  private _chunkedRead(key: string): Promise<IConfigFile> {
    return new Promise((resolve) => {
      if (typeof key !== "string") key = `${key}`;
      const keyNum = key + "#";
      chrome.storage.sync.get(keyNum, (data) => {
        if (data == undefined) {
          throw new Error("Local config is not configured for chunked reads.");
        }
        const num = data[keyNum];
        console.log(`Config file chunks: ${num}`);
        const keys: any[] = [];
        for (let i = 0; i < num; i++) {
          keys[i] = key + i;
        }
        chrome.storage.sync.get(keys, (data) => {
          const chunks: any[] = [];
          for (let i = 0; i < num; i++) {
            chunks.push(data[key + i] || "");
          }
          const str = chunks.join("");
          resolve(str ? JSON.parse(str) : undefined);
        });
      });
    });
  }
}
