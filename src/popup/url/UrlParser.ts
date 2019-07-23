import { IUrlComponents, StringMap } from "./IUrlComponents";

export class UrlParser {
    public parseUrl(): Promise<IUrlComponents> {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                if (!tabs[0].url) {
                    throw "couldn't read active tab url";
                }
                let url = new URL(tabs[0].url);
                let queries = <StringMap<string>>{};
                url.searchParams.forEach((val, key) => queries[key] = val); // this will lose duplicate keys but we don't expect those
                // TODO get location and test extension
                resolve({
                    host: url.host,
                    queries
                });
            });
        });
    }

    public setUrl(host: string, query: any[], location: string, testExtension?: string): Promise<void> {
        let url = new URL(host);
        return new Promise((resolve, reject) => chrome.tabs.update({ url: url.href }, () => {
            resolve();
            window.close();
        }));
    }
}
/*
function parseTestExtension(testExtensions) {
  if (!testExtensions) { return ""; }

  var parts = testExtensions.split("=");
  if (parts.length < 2 || parts[0].toLowerCase() != "testextensions") { return ""; }
  var obj = JSON.parse(decodeURIComponent(parts[1]));

  return Object.keys(obj)[0] || "";
}
*/