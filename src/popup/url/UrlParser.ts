import { IUrlComponents } from "./IUrlComponents";

export default class UrlParser {
    public parseUrl(): Promise<IUrlComponents> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                if (!tabs[0].url) {
                    throw "couldn't read active tab url";
                }

                let url = new URL(tabs[0].url);

                let query: StringMap<string> = {};
                url.searchParams.forEach((value, key) => query[key] = value); // this loses duplicate keys but we don't expect those

                let fragmentParts = url.hash.split("?");

                resolve({
                    origin: url.origin,
                    query,
                    fragment: fragmentParts[0],
                    testExtension: fragmentParts.length > 1 && this._parseTestExtension(fragmentParts[1]) || undefined
                });
            });
        });
    }

    public setUrl(urlComponents: IUrlComponents): Promise<void> {
        let url = new URL(urlComponents.origin);
        Object.keys(urlComponents.query).forEach(key => url.searchParams.set(key, urlComponents.query[key]));
        url.hash = `${urlComponents.fragment}${urlComponents.testExtension ? `?${this._stringifyTestExtension(urlComponents.testExtension)}` : ""}`;
        return new Promise((resolve, reject) => chrome.tabs.update({ url: url.href }, () => {
            resolve();
            window.close();
        }));
    }

    private _parseTestExtension(fragmentQuery: string): string | null {
        // testExtensions={"Microsoft_Intune_Enrollment":"https://localhost:44300/"}
        let match = fragmentQuery.match(/^testextensions={"(.*?)":"(.*?)"}$/i);
        return match && match[1];
    }

    private _stringifyTestExtension(testExtension: string) {
        return `testExtensions={"${testExtension}":"https://localhost:44300/"}`;
    }
}