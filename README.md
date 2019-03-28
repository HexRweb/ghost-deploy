# Ghost Deploy

[![Build Status](https://travis-ci.org/HexRweb/ghost-deploy.svg?branch=master)](https://travis-ci.org/HexRweb/ghost-deploy)
[![Coverage Status](https://coveralls.io/repos/github/HexRweb/ghost-deploy/badge.svg?branch=master)](https://coveralls.io/github/HexRweb/ghost-deploy?branch=master)
[![NPM Version](https://img.shields.io/npm/v/ghost-deploy.svg)](https://npmjs.com/package/ghost-deploy)
[![dependencies Status](https://david-dm.org/hexrweb/ghost-deploy/status.svg)](https://david-dm.org/hexrweb/ghost-deploy)

Deploy your Ghost theme to a running Ghost instance

# Installation

Ghost Deploy is available via the NPM Registry

Ghost Deploy 2.0.0 is compatible with Ghost's v2 API. The SDK and API currently don't have support for activating a theme, so publishing 2.0.0 to NPM is being held off because that would be a regression

# Usage
*Note: Ghost Deploy will **overwrite** an existing theme if it has the same name.*

```js

const deploy = require('ghost-deploy');
const {resolve} = require('path');

// execute build-related activities

return deploy({
  url: 'https://example.com', // API URL in custom integration
  key: 'integrationAdminAPIKey', // Admin API Key in custom integration
  themePath: resolve(process.cwd(), 'built', 'example-theme.zip'),
  activateTheme: true // This won't work right now!
}).then(() => {
  console.log('deployment succeeded!');
});

```

[example](https://github.com/hexrweb/ghost-deploy/tree/master/test/acceptance/successful-upload-spec.js)

# Deploy options

Required options: url, key, themePath

## key (required)

_This option is passed directly to the Admin SDK_

In order to upload a theme to your Ghost instance, you need to have permission. With the Ghost v2 API, ghost-deploy gets permission from the Admin API Key. Here are the steps to obtain the key:

1. Navigate to your admin interface
2. Click the `Integrations` navigation link
3. In the Custom integrations section, click `Add custom integration`.
4. Supply a name (e.g. Deploy)
5. Click `Create`
6. The key needed by ghost-deploy is the `Admin API Key` - hover over the text, and you can copy the entire thing!

## url (required)

_This option is passed directly to the Admin SDK_

The URL for your Ghost instance. Make sure you don't mess this up, because otherwise your token could be sent to someone else! Check out the [Ghost Docs](https://docs.ghost.org/api/javascript/admin/#authentication) for the current URL requirements and suggestions.

```js
deploy({
  url: 'http://localhost:2368', // Default Ghost url
  // Other options
});
```

## Theme Path (required)

This is the path to your *zipped* Ghost Theme.

```js
deploy({
  themePath: '/path/to/theme.zip',
  // Other options
});
```

## Validate Theme (optional, default: true)

Ghost Deploy can validate your theme using [gscan](https://gscan.ghost.org). All default options are used, and validation fails if there are any errors or warnings. If you're using an older ruleset (for example, gscan currently uses Ghost 2.0 rules - if you're on Ghost 1.x, theme validation will fail), or if you already run gscan as part of your deployment process, you can set this to false

```js
deploy({
  // Other options
  validateTheme: false
});
```

## Activate Theme (optional, default: false)

Ghost Deploy can activate your theme after uploading, although it doesn't by default. If you choose to not activate your theme (default), it will be available in the Ghost Admin panel, in the design section, to activate.

```js
deploy({
  // Other options
  activateTheme: true
});
```

# Putting it all together

You can see an example of how to use Ghost Deploy in our [Acceptance Test](https://github.com/hexrweb/ghost-deploy/tree/master/test/acceptance/successful-upload-spec.js)

# Issues and Support

Feel free to create an issue if you have any questions, feature requests or found a bug. As of now, there's no specific template, but if the volume of discussion gets out of hand, something will be put in place. If you want to contact us directly, shoot us an email - hello@hexr.org

# Contributing

Feel free to create a Pull Request if you think any changes should be made. You don't have to explain yourself, but be able to if requested.

# License

Copyright 2018 HexR under the [MIT License](https://github.com/HexRweb/Ghost-Deploy/blob/master/LICENSE).