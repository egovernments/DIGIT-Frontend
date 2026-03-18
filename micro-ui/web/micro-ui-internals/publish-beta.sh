#!/bin/bash

BASEDIR="$(cd "$(dirname "$0")" && pwd)"

msg() {
  echo -e "\n\n\033[32;32m$1\033[0m"
}

BETA_TAG="--tag core-beta-cms"

msg "Building and publishing svg components (beta)"
cd "$BASEDIR/packages/svg-components" && rm -rf dist && yarn && npm publish --access public $BETA_TAG

msg "Building and publishing css (beta)"
cd "$BASEDIR/packages/css" && rm -rf dist && yarn && npm publish --access public $BETA_TAG

msg "Building and publishing libraries (beta)"
cd "$BASEDIR/packages/libraries" && rm -rf dist && yarn && npm publish --access public $BETA_TAG

msg "sleeping for 5 seconds to avoid npm dependency issues"
sleep 5

msg "Building and publishing react-components (beta)"
cd "$BASEDIR/packages/react-components" && rm -rf dist && yarn && npm publish --access public $BETA_TAG

msg "sleeping for 10 seconds to avoid npm dependency issues"
sleep 10

msg "Building and publishing Core module (beta)"
cd "$BASEDIR/packages/modules/core" && rm -rf dist && yarn && npm publish --access public $BETA_TAG

msg "Building and publishing Engagement module (beta)"
cd "$BASEDIR/packages/modules/engagement" && rm -rf dist && yarn && npm publish --access public $BETA_TAG

msg "Building and publishing hrms module (beta)"
cd "$BASEDIR/packages/modules/hrms" && rm -rf dist && yarn && npm publish --access public $BETA_TAG

msg "Building and publishing DSS module (beta)"
cd "$BASEDIR/packages/modules/dss" && rm -rf dist && yarn && npm publish --access public $BETA_TAG

msg "Building and publishing Common module (beta)"
cd "$BASEDIR/packages/modules/common" && rm -rf dist && yarn && npm publish --access public $BETA_TAG

msg "Building and publishing Utilities module (beta)"
cd "$BASEDIR/packages/modules/utilities" && rm -rf dist && yarn && npm publish --access public $BETA_TAG

msg "Building and publishing workbench module (beta)"
cd "$BASEDIR/packages/modules/workbench" && rm -rf dist && yarn && npm publish --access public $BETA_TAG

msg "Building and publishing pgr module (beta)"
cd "$BASEDIR/packages/modules/pgr" && rm -rf dist && yarn && npm publish --access public $BETA_TAG

msg "Building and publishing OpenPayment module (beta)"
cd "$BASEDIR/packages/modules/open-payment" && rm -rf dist && yarn && npm publish --access public $BETA_TAG

msg "Building and publishing Sandbox module (beta)"
cd "$BASEDIR/packages/modules/sandbox" && rm -rf dist && yarn && npm publish --access public $BETA_TAG
