# Ghost Deploy

[![Build Status](https://travis-ci.org/HexRweb/ghost-deploy.svg?branch=master)](https://travis-ci.org/HexRweb/ghost-deploy)
[![Coverage Status](https://coveralls.io/repos/github/HexRweb/ghost-deploy/badge.svg?branch=master)](https://coveralls.io/github/HexRweb/ghost-deploy?branch=master)
[![NPM Version](https://img.shields.io/npm/v/ghost-deploy.svg)](https://npmjs.com/package/ghost-deploy)
[![dependencies Status](https://david-dm.org/hexrweb/ghost-deploy/status.svg)](https://david-dm.org/hexrweb/ghost-deploy)

Deploy your Ghost theme to a running Ghost instance

# Installation

Ghost Deploy is available via the NPM Registry

```bash
npm install --save-dev ghost-deploy
```

# Usage
*Note: Ghost Deploy will **overwrite** an existing theme if it has the same name.*

```js

const deploy = require('ghost-deploy');
const {resolve} = require('path');

// execute build-related activities

return deploy({
  url: 'https://example.com',
  token: 'ghostAccessToken', // see the `Authentication` section
  themePath: resolve(process.cwd(), 'built', 'example-theme.zip'),
  activateTheme: true
}).then(() => {
  console.log('deployment succeeded!');
});

```

[example](https://github.com/hexrweb/ghost-deploy/tree/master/test/acceptance/successful-upload-spec.js)

# Deploy options

Required options: authentication, themePath, url

## Authentication (required)

**Note: the permissions of the token / password need to be able to upload and activate themes**

A bulk of the options relate to authentication. Ghost Deploy supports 2 methods of authentication - token based, and password based. Password based authentication eventually becomes token-based authentication, but obtaining a token requires more effort on your end.

It doesn't matter what method you choose. If you're already using / creating a token in your code, you can pass that token to Ghost Deploy. Otherwise, don't worry about obtaining one; pass your credentials to Ghost Deploy.

If you go the token route, you just need to provide the access token

```js
deploy({
  // Authentication by token
  token: 'accessToken',
  // Other options
});
```

If you go the password route, you need to provide the following details:

- username (email) + password
  - This is how you log into Ghost from the admin panel
- id + secret (short for client_id and client_secret)
  - Check out the [API docs](https://api.ghost.org/docs/ajax-calls-from-an-external-website) for information relating to creating a client. You don't need to add any trusted domains since this is run on a server / not client

```js
deploy({
  // Authentication by password
  username: 'ghost@example.com',
  password: 'Sup3R$3cUr3P@sS!!',
  id: 'ghost-deploy',
  secret: 'rAndOmLeTTerS',
  // Other options
});
```

### Cleanup

If you use password authentication, Ghost Deploy will attempt to destroy the access and refresh tokens it created to upload your theme. This isn't guaranteed to work, although it should for the most part.

## URL (required)

The URL for your Ghost instance. Make sure you don't mess this up, because otherwise your credentials / token will be sent to someone else. Ghost Deploy runs a very basic sanity check to make sure the API responds appropriately, but there's no guarantee it's a valid Ghost instance.

Ghost Deploy transforms the URL so you don't need to provide the entire thing

https://example.com becomes https://example.com/ghost/api/v0.1<br/>
https://example.com/ghost becomes https://example.com/ghost/api/v0.1<br/>
(etc)

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