# WebAssembly PicoTool

This repo contains the NPM Module of the WebAssembly port of Raspberry Pi's picotool for [leaphy webbased](https://leaphyeasybloqs.com)

## Building
1. Building WASM binaries with emscripten

Ensure Emscripten is installed and active using [the install guide](https://emscripten.org/docs/getting_started/downloads.html). After which run
``./build.sh``

2. Building NPM Module
``yarn build``

## Testing with Webbased
1. First build the WASM binaries and the NPM module using the previous steps. 
2. Secondly run ``yarn link`` from this repo.
3. Lastly run ``yarn link "@leaphy-robotics/picotool-wasm"`` from your [local webbased](https://github.com/leaphy-robotics/leaphy-webbased)
