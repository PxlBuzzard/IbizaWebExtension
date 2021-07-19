import { IUrlComponents } from "./IUrlComponents";

export default class UrlParser {
    public parseUrl(): Promise<IUrlComponents> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                if (!tabs[0].url) {
                    throw "couldn't read active tab url";
                }

                const url = new URL(tabs[0].url);

                const query: StringMap<string> = {};
                url.searchParams.forEach((value, key) => query[key] = value); // this loses duplicate keys but we don't expect those

                const fragmentParts = url.hash.split("?");

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
        const url = new URL(urlComponents.origin);
        Object.keys(urlComponents.query).forEach(key => url.searchParams.set(key, urlComponents.query[key]));
        url.hash = `${urlComponents.fragment}${urlComponents.testExtension ? `?${this._stringifyTestExtension(urlComponents.testExtension, urlComponents.sideloadUrl)}` : ""}`;
        if (urlComponents.testExtension) {
            url.searchParams.set("feature.canmodifyextensions", "true");
        }

        return new Promise((resolve, reject) => {
            const listener = () => chrome.tabs.reload(() => {
                chrome.tabs.onUpdated.removeListener(listener);
                resolve();
                window.close();
            });
            chrome.tabs.onUpdated.addListener(listener);
            chrome.tabs.update({ url: url.href });
        });
    }

    private _parseTestExtension(fragmentQuery: string): string | null {
        // testExtensions={"Microsoft_Intune_Enrollment":"https://localhost:44300/"}
        const match = fragmentQuery.match(/^testextensions={(?:"|%22)(.*?)(?:"|%22):(?:"|%22)(.*?)(?:"|%22)}$/i);
        return match && match[1];
    }

    private _stringifyTestExtension(testExtension: string, sideloadUrl?: string) {
        return `testExtensions={"${testExtension}":"${sideloadUrl != null ? sideloadUrl : "https://localhost:44300/"}"}`;
    }
}
