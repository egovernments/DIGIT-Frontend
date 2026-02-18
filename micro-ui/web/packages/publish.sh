#!/bin/bash

BASEDIR="$(cd "$(dirname "$0")" && pwd)"

msg() {
  echo -e "\n\n\033[32;32m$1\033[0m"
}


# msg "Pre-building all packages"
# yarn build
# sleep 5

msg "Building and publishing css"
cd "$BASEDIR/css" && rm -rf dist && yarn && yarn build && npm publish --tag console-0.5


msg "Building and publishing core"
cd "$BASEDIR/modules/core" && rm -rf dist && yarn && yarn build && npm publish --tag console-0.5

msg "Building and publishing workbench"
cd "$BASEDIR/modules/workbench" && rm -rf dist && yarn && yarn build && npm publish --tag console-0.5

