#!/bin/sh

set -e

BRANCH="$(git branch --show-current 2>/dev/null || echo 'main')"

echo "Main Branch: $BRANCH"

STUDIO_REPO="DIGIT-Studio"

if [ ! -d "$STUDIO_REPO" ]; then
    echo "Cloning DIGIT-Studio repository..."
    if [ -n "$GIT_TOKEN" ]; then
        git clone -b develop-ui-rc19 "https://${GIT_TOKEN}@github.com/egovernments/DIGIT-Studio.git" "$STUDIO_REPO"
    else
        git clone -b develop-ui-rc19 "https://github.com/egovernments/DIGIT-Studio.git" "$STUDIO_REPO"
    fi
fi

# Path to packages in the cloned repo (adjust based on actual structure)
PACKAGES_PATH="$STUDIO_REPO/frontend/web/packages"

# Fallback paths if structure is different
if [ ! -d "$PACKAGES_PATH" ]; then
    PACKAGES_PATH="$STUDIO_REPO/packages"
fi

if [ ! -d "$PACKAGES_PATH" ]; then
    PACKAGES_PATH="$STUDIO_REPO/health/micro-ui/packages"
fi

if [ -d "$PACKAGES_PATH" ]; then
    echo "Found packages at: $PACKAGES_PATH"
    echo "Copying packages folder..."
    rm -rf packages
    cp -r "$PACKAGES_PATH" packages
    echo "Packages copied successfully"
else
    echo "Error: packages directory not found in any expected location"
    echo "Searched in:"
    echo "  - $STUDIO_REPO/frontend/web/packages"
    echo "  - $STUDIO_REPO/packages"
    echo "  - $STUDIO_REPO/health/micro-ui/packages"
    exit 1
fi

# Copy UICustomizations.js if it exists
CUSTOMIZATIONS_PATHS="
$STUDIO_REPO/frontend/web/example/src/UICustomizations.js
$STUDIO_REPO/example/src/UICustomizations.js
$STUDIO_REPO/health/micro-ui/web/src/Customisations/UICustomizations.js
"

for CUSTOM_PATH in $CUSTOMIZATIONS_PATHS; do
    if [ -f "$CUSTOM_PATH" ]; then
        echo "Copying UICustomizations.js from $CUSTOM_PATH..."
        mkdir -p src/Customisations
        cp "$CUSTOM_PATH" src/Customisations/
        break
    fi
done

echo "Dependencies installation completed"