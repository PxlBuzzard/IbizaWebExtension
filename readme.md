# Azure Portal Developer Extension

## Development

`npm install`
`npm run build:dev`

## Test

- Open up chrome and go to - `chrome://extensions`
- Select `Developer mode`
- Click on `Load unpacked`, navigate to the `/dist` folder, and hit `Select`
- Go to `endpoint.microsoft.com`

## Preparing a release

- `npm run build`
- Go to the Chrome Web Store Developer Dashboard
- Upload new package, use `extension.zip` from the root folder
- Update the config if necessary
