#!/bin/bash

BASEDIR="$( cd "$( dirname "$0" )" && pwd )"

msg() {
  echo -e "\n\n\033[32;32m$1\033[0m"
}

msg "Cleaning root"
rm -rf node_modules

msg "Cleaning css"
cd "$BASEDIR/packages/css" && rm -rf node_modules


msg "Cleaning Campaign module"
cd "$BASEDIR/packages/modules/campaign-manager" && rm -rf node_modules

msg "Cleaning microplanning module"
cd "$BASEDIR/packages/modules/hcm-microplanning" && rm -rf node_modules

msg "Cleaning DSS module"
cd "$BASEDIR/packages/modules/health-dss" && rm -rf node_modules


msg "Cleaning hrms module"
cd "$BASEDIR/packages/modules/health-hrms" && rm -rf node_modules

msg "Cleaning payments module"
cd "$BASEDIR/packages/modules/health-payments" && rm -rf node_modules

msg "Cleaning microplan  module"
cd "$BASEDIR/packages/modules/microplan" && rm -rf node_modules


msg "Cleaning pgr  module"
cd "$BASEDIR/packages/modules/pgr" && rm -rf node_modules

msg "Cleaning workbench-hcm  module"
cd "$BASEDIR/packages/modules/workbench-hcm" && rm -rf node_modules