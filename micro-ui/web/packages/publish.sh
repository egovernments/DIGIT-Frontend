#!/bin/bash

BASEDIR="$(cd "$(dirname "$0")" && pwd)"
ROOTDIR="$(cd "$BASEDIR/../../.." && pwd)"

msg() {
  echo -e "\n\n\033[32;32m$1\033[0m"
}

########################################
msg "Installing workspace dependencies"
cd "$ROOTDIR" && yarn install --frozen-lockfile
########################################

msg "Building and publishing css"
cd "$BASEDIR/css" && rm -rf dist && yarn build && npm publish --tag console-0.5

msg "Building and publishing core"
cd "$BASEDIR/modules/core" && rm -rf dist && yarn build && npm publish --tag console-0.5

msg "Building and publishing workbench"
cd "$BASEDIR/modules/workbench" && rm -rf dist && yarn build && npm publish --tag console-0.5
