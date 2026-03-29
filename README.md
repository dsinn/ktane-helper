# ktane-helper

https://dsinn.github.io/ktane-helper

## Local setup

 1. Ensure NodeJS and npm are installed ([Download](https://nodejs.org/en/download/))
 2. Run `npm ci && node node_modules/esbuild/install.js`
    - `.npmrc` disables install scripts for security; esbuild requires its postinstall script to be run manually to download its platform-specific binary
 3. Run `npm run start`
