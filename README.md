# ado-pat

`ado-pat` is a CLI and a library to help tool authors get a functioning user PAT for Azure DevOps. The package wraps the `msal-node` and `msal-node-extension` packages to do its work of retrieving an Entra ID access token with cached persistence.

## Installation

Globally

```
$ npm install --global ado-pat
```

Locally

```
$ npm install ado-pat
```

## Usage as CLI

Get help from the tool

```
$ ado-pat --help

Usage: ado-pat [options]

Options:
  -t, --tenant-id <tenant id>        Azure AD tenant ID
  -d, --display-name <display name>  Display name for the PAT
  -o, --organization <org>           Azure DevOps organization name
  -h, --help                         display help for command
```

## Usage as Node.js API

(for now, this is a CommonJS package)

```js
const { getPAT, acquireEntraIdToken } = require("ado-pat");
const token = await acquireEntraIdToken();
const pat = await getPAT({
  organization: "your org",
  token: token.accessToken,
});
```