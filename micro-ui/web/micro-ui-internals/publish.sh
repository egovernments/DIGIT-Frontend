#!/bin/bash

BASEDIR="$(cd "$(dirname "$0")" && pwd)"

msg() {
  echo -e "\n\n\033[32;32m$1\033[0m"
}


# msg "Pre-building all packages"
# yarn build
# sleep 5

msg "Building and publishing urban-css"
cd "$BASEDIR/packages/css" && rm -rf dist && yarn && npm publish --tag urban-1.0

msg "Building and publishing property-tax module"
cd "$BASEDIR/packages/modules/property-tax" && rm -rf dist && yarn && npm publish --tag property-tax-1.0