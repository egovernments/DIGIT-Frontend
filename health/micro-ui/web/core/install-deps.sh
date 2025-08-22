#!/bin/sh

BRANCH="$(git branch --show-current)"

echo "Main Branch: $BRANCH"

INTERNALS="micro-ui-internals"
cd ..

# Function to safely copy files
copy_file() {
    if [ ! -f "$1" ]; then
        echo "Error: Source file $1 not found"
        exit 1
    fi
    cp "$1" "$2" || { echo "Error: Failed to copy $1 to $2"; exit 1; }
}

copy_file "core/App.js" "src"
copy_file "core/package.json" "package.json"
copy_file "core/webpack.config.js" "webpack.config.js"
copy_file "core/inter-package.json" "$INTERNALS/package.json"
copy_file "$INTERNALS/example/src/UICustomizations.js" "src/Customisations"

echo "UI :: core " && echo "Branch: $(git branch --show-current)" && echo "$(git log -1 --pretty=%B)" && echo "installing packages" 

