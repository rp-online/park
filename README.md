# RPO templates

## Requirements

### NodeJS LTS version (currently version 8)

```sh
node -v
```
NodeJS can be installed via `brew install node` or can be downloaded from https://nodejs.org/en/download/

On Windows, add a user specific environment variable named `NODE_PATH` and set it to `%AppData%\npm\node_modules`.

### Yarn > 1

```sh
yarn --version
sudo npm install yarn@1.9.4 -g
```

Yarn can be installed via `brew install yarn` or from https://yarnpkg.com/en/docs/install

### Node-Gyp 
```sh
npm install -g node-gyp
```

### XCODE Command Line Tools
On Mac, you also need to install the Command Line Tools via Xcode. You can find this under the menu Xcode -> Preferences -> Downloads

### Gulp
```sh
npm install -g gulp
```

## Setup

```sh
# Clone this repository
git clone https://github.com/rp-online/templates

# Install dependencies
yarn
```


## Development

Run a local dev server on port 3000 serving the `dist/` directory and rebuilding on changes:

```sh
yarn start
```

Run build

```sh
yarn run build
```

Run a faster build (excludes critical-css task)

```sh
yarn run fastbuild
```

Run SCSS linting:

```sh
yarn lint:scss
```

Run JavaScript linting:

```sh
yarn lint:js
```

### Pages

All pages in the `pages/` directory will be build to `dist/{pageName}.html`.

Moreover, an overview of all components will be build to `dist/inventory.html`.

### Twig

Since **Twig** is a template language we can render these templates without php using *twig.js*.


### JavaScript

We follow [Airbnb's](https://github.com/airbnb/javascript) rules for writing JavaScript and enforce these by using **eslint**.

These rules can be adjusted in the `.eslintrc` file and should be approved by the entire team.


### SCSS

Stylelinting is done with following [preset](https://github.com/stylelint/stylelint-config-standard)

These rules can be adjusted in the `.stylelintrc` file and should be approved by the entire team.

#### SCSS Structure

ITCSS

* Settings - SCSS variables
  * breakpoints
  * colors
  * typography
* Tools - Mixins and Functions
  * clearfix
  * hidden
  * z-index
* Generic - resets
 * reset.css 2.0
 * box-sizing
* Elements - unclassed elements
  * images
  * typography
* Components - UI Components written with BEM


## Deployment
