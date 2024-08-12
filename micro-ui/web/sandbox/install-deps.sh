#!/bin/sh

BRANCH="$(git branch --show-current)"

echo "Main Branch: $BRANCH"

INTERNALS="micro-ui-internals"
cd ..

cp sandbox/App.js src
cp sandbox/package.json package.json 
cp sandbox/webpack.config.js webpack.config.js 
cp sandbox/inter-package.json $INTERNALS/package.json

cp $INTERNALS/example/src/UICustomizations.js src/Customisations

echo "UI :: Sandbox " && echo "Branch: $(git branch --show-current)" && echo "$(git log -1 --pretty=%B)" && echo "installing packages" 

