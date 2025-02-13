# Client – Vue.js Frontend

This [Vue.js](https://vuejs.org/) template provides sample code how to connect to the ExpressJS backend.

## Client Structure

| File        | Purpose           | What you do?  |
| ------------- | ------------- | ----- |
| [README.md](./README.md) | Everything about the client | **READ ME** carefully! |
| [public/favicon.ico](public/favicon.ico) | [Favicon](https://en.wikipedia.org/wiki/Favicon) website icon | — |
| [index.html](index.html) | Static HTML entry point page | — |
| [src/](src/) | src (i.e., source code) | All your code goes in here |
| [src/Api.js](src/Api.js) | Configures HTTP library to communicate with backend | — |
| [src/App.vue](src/App.vue) | Main Vue layout template for all view (or pages) | Change your global template for all views |
| [src/assets/](src/assets/) | Graphical resources | Add your images, logos, etc |
| [src/components/](src/components) | Vue components that are reusable LEGO blocks | Add your custom components here |
| [src/views/](src/views) | Vue components that are separate pages/views | Add new routes/pages/views |
| [src/main.js](src/main.js) | Main JavaScript entry point | — |
| [src/router.js](src/router.js) | Vue routes configuration | Register new routes/pages/views |
| [src/views/Home.vue](src/views/Home.vue) | Home page/view | Replace with your home page/view |
| [package.json](package.json) | Project meta-information | —|
| [vite.config.js](vite.config.js) | Vue configuration | — |

## Requirements

* [Server](../server/README.md) backend running on `http://localhost:5045`
* [Node.js](https://nodejs.org/en/download/) => installation instructions for [Linux](https://github.com/nodesource/distributions)
* [Visual Studio Code (VSCode)](https://code.visualstudio.com/) as IDE
  * [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) plugin for Vue tooling
  * [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) plugin for debugging
* [Google Chrome](https://www.google.com/chrome/) as web browser
  * [Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en) plugin for debugging

## Project setup

Make sure, you are in the client directory `cd scalyshop-v2-frontend`

Installs all project dependencies specified in [package.json](./package.json).

```sh
npm install
```

### Compiles and hot-reloads for development

Automatically recompiles and refreshes the browser tab if you save any changes to local files.

```sh
npm run serve
```

### Compiles and minifies for production

Builds the production-ready website into the `dist` directory. Would be the way to actually bundle the application for hosting in a separate web server such as Apache (which we are not planning to do in this class).

```sh
npm run build
```

* [JavaScript Standard Style](https://standardjs.com/rules-en.html)
* [Are Semicolons Necessary in JavaScript? (8' background explanation)](https://youtu.be/gsfbh17Ax9I)

> The Vue.js community [favors](https://forum.vuejs.org/t/semicolon-less-code-my-thoughts/4229) omitting optional semicolons `;` in Javascript.

## Axios HTTP Library

* [Documentation with Examples](https://github.com/axios/axios#axios)

## Debug in VSCode with Chrome

1. **[VSCode]** Set a breakpoint in your Javascript code
2. **[Terminal]** Run `npm run serve` to serve the client
3. **[VSCode]** Select *Debug > Start Debugging (F5)* to automatically start a debug session in Chrome[<sup>1</sup>](#1)
4. **[Chrome]** Browse in Chrome to trigger your breakpoint and the focus will jump back to VSCode

Find illustrated instructions in the [Vuejs Debug Docs](https://vuejs.org/v2/cookbook/debugging-in-vscode.html).

<a class="anchor" id="1"><sup>1</sup></a> Chrome will launch with a separate user profile (not to mess up with your familiar daily Chrome profile) in a temp folder as described in the VSCode [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome). It is recommended to install the [vue-devtools](https://github.com/vuejs/vue-devtools) [Chrome Extension](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) there.

#### Copyright Disclaimer
###### The product and basket icons were downloaded from [flaticon.com](https://www.flaticon.com/free-icon/game-console_1083364?term=video%20game&page=1&position=17&page=1&position=17&related_id=1083364&origin=search).