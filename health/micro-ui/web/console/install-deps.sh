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

# Copy proxy server files if they exist
if [ -f console/proxy-server.js ]; then
    echo "Copying proxy server files..."
    cp console/proxy-server.js .
fi

if [ -f console/proxy-package.json ]; then
    cp console/proxy-package.json .
fi

echo "UI :: console " && echo "Branch: $(git branch --show-current)" && echo "$(git log -1 --pretty=%B)" && echo "installing packages" 

