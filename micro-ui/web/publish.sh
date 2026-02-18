#!/bin/bash

BASEDIR="$(cd "$(dirname "$0")" && pwd)"

msg() {
  echo -e "\n\n\033[32;32m$1\033[0m"
}

cd "$BASEDIR"

msg "Installing dependencies at workspace root"
yarn install --frozen-lockfile


####################################
msg "Building and publishing css"
cd packages/css
rm -rf dist
yarn build
npm publish --tag console-0.5


####################################
msg "Building and publishing core"
cd ../modules/core
rm -rf dist
yarn build
npm publish --tag console-0.5


####################################
msg "Building and publishing workbench"
cd ../workbench
rm -rf dist
yarn build
npm publish --tag console-0.5
