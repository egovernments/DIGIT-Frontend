#!/bin/sh

BRANCH="$(git branch --show-current)"

echo "Main Branch: $BRANCH"

INTERNALS="micro-ui-internals"

cp $INTERNALS/example/src/UICustomizations.js src/Customizations

cd $INTERNALS && echo "Branch: $(git branch --show-current)" && echo "$(git log -1 --pretty=%B)" && echo "installing packages"


# yarn install
