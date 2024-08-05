#!/bin/bash

# Delete all node_modules directories
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

# Delete all package-lock.json files
find . -name "package-lock.json" -type f -delete

# Optionally, delete yarn.lock files if using Yarn
find . -name "yarn.lock" -type f -delete
