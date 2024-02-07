#!/bin/bash

BASEDIR="$(cd "$(dirname "$0")" && pwd)"

msg() {
  echo -e "\n\n\033[32;32m$1\033[0m"
}

# msg "Pre-building all packages"
# yarn build
# sleep 5


msg "Building and publishing react-components"
cd "$BASEDIR/packages/ui-components" && rm -rf dist && yarn && npm publish --tag mfe

msg "Building and publishing libraries"
cd "$BASEDIR/packages/ui-libraries" && rm -rf dist && yarn && npm publish --tag mfe

# msg "Building and publishing Core module"
cd "$BASEDIR/packages/ui-core" &&   rm -rf dist && yarn&& npm publish --tag mfe



# msg "Building and publishing hrms module"
cd "$BASEDIR/packages/hrms" &&   rm -rf dist && yarn&& npm publish --tag mfe

# msg "Building and publishing DSS module"
cd "$BASEDIR/packages/dss" &&  rm -rf dist && yarn&& npm publish --tag mfe


# msg "Building and publishing Utilities module"
cd "$BASEDIR/packages/workbench" &&   rm -rf dist && yarn&& npm publish --tag mfe
