# Azure Portal Developer Extension

This web extension exists to make day-to-day operations of Intune UI developers easier.

## Development

- `npm install`
- `npm run build:dev`

### How the config file works

Each time the extension is opened by a user, we check for a new version of the config.json file. If the remote version is newer, it is downloaded and used the next time the extension is opened. This way updates can be shipped without needing to update the Chrome Store every time there is a change.

Any breaking changes to the config file need to be a new major version, and the COMPATIBLE_VERSION in ConfigLoader.ts should be updated to match. That way, breaking config file changes will not be consumed by an older version of the extension.

## Test

- Open up Chrome or Edge and go to - `chrome://extensions`
- Select `Developer mode`
- Click on `Load unpacked`, navigate to the `/dist` folder, and hit `Select`
- Go to `endpoint.microsoft.com`

## Preparing a release

- `npm run build`
- Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- Upload new package, use `extension.zip` from the root folder
