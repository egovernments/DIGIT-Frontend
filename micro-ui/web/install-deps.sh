#!/bin/sh

BRANCH="$(git branch --show-current)"

echo "Main Branch: $BRANCH"

INTERNALS="frontend/web/micro-ui-internals"

git clone -b STUDIO-UI-4 https://github.com/egovernments/DIGIT-Studio.git $INTERNALS


cp $INTERNALS/example/src/UICustomizations.js src/Customisations
cd $INTERNALS && echo "Branch: $(git branch --show-current)" && echo "$(git log -1 --pretty=%B)" && yarn && yarn build && find . -name "node_modules" -type d -prune -print -exec rm -rf '{}' \;
cd ..

rm -rf node_modules
rm yarn.lock

fi
# cd $INTERNALS && echo "Branch: $(git branch --show-current)" && echo "$(git log -1 --pretty=%B)" && echo "installing packages"


# yarn install
