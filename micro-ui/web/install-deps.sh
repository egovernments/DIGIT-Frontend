#!/bin/sh

set -e

STUDIO_REPO="DIGIT-Studio"

rm -rf "$STUDIO_REPO"

echo "Cloning DIGIT-Studio repository..."

if [ -n "$GIT_TOKEN" ]; then
    git clone -b develop-dev-pdf \
    "https://${GIT_TOKEN}:x-oauth-basic@github.com/egovernments/DIGIT-Studio.git" \
    "$STUDIO_REPO"
else
    git clone -b develop-dev-pdf \
    "https://github.com/egovernments/DIGIT-Studio.git" \
    "$STUDIO_REPO"
fi

cd "$STUDIO_REPO"

echo "Latest pulled commit:"
git log -1 --oneline

cd ..

# Path to packages in the cloned repo
PACKAGES_PATH="$STUDIO_REPO/frontend/web/packages"

# Fallback paths
if [ ! -d "$PACKAGES_PATH" ]; then
    PACKAGES_PATH="$STUDIO_REPO/packages"
fi

if [ ! -d "$PACKAGES_PATH" ]; then
    PACKAGES_PATH="$STUDIO_REPO/health/micro-ui/packages"
fi

if [ -d "$PACKAGES_PATH" ]; then
    echo "Found packages at: $PACKAGES_PATH"

    rm -rf packages
    cp -r "$PACKAGES_PATH" packages

    echo "Packages copied successfully"
else
    echo "Error: packages directory not found"

    echo "Searched:"
    echo " - $STUDIO_REPO/frontend/web/packages"
    echo " - $STUDIO_REPO/packages"
    echo " - $STUDIO_REPO/health/micro-ui/packages"

    exit 1
fi

# Copy UICustomizations.js if present
CUSTOMIZATIONS_PATHS="
$STUDIO_REPO/frontend/web/example/src/UICustomizations.js
$STUDIO_REPO/example/src/UICustomizations.js
$STUDIO_REPO/health/micro-ui/web/src/Customisations/UICustomizations.js
"

for CUSTOM_PATH in $CUSTOMIZATIONS_PATHS; do
    if [ -f "$CUSTOM_PATH" ]; then
        echo "Copying UICustomizations.js from $CUSTOM_PATH"

        mkdir -p src/Customisations
        cp "$CUSTOM_PATH" src/Customisations/

        break
    fi
done

echo "Dependencies installation completed"
