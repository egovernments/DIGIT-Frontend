#!/bin/sh

BRANCH="$(git branch --show-current)"

echo "Main Branch: $BRANCH"

INTERNALS="micro-ui-internals"
cd ..

cp console/App.js src
cp console/package.json package.json 
cp console/webpack.config.js webpack.config.js 
cp console/inter-package.json $INTERNALS/package.json

cp $INTERNALS/example/src/UICustomizations.js src/Customisations

echo "UI :: console " && echo "Branch: $(git branch --show-current)" && echo "$(git log -1 --pretty=%B)" && echo "installing packages" 

