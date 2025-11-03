#!/bin/bash

# Script to test different build variants locally

echo "Multi-Variant Build Testing Script"
echo "==================================="
echo ""

# Check if packages need to be migrated
if [ -d "micro-ui-internals" ] && [ ! -d "packages/modules" ]; then
    echo -e "${YELLOW}Warning: Packages are still in micro-ui-internals directory.${NC}"
    echo -e "${YELLOW}Run ./migrate-packages.sh to move them to web/packages${NC}"
    echo ""
fi

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to test a variant
test_variant() {
    local variant=$1
    echo -e "${YELLOW}Testing variant: $variant${NC}"
    
    # Copy the variant-specific package.json
    cp builds/$variant/package.json package.json
    echo "✓ Copied $variant/package.json"
    
    # Copy the variant-specific index.js
    cp builds/$variant/index.js src/index.js
    echo "✓ Copied $variant/index.js"
    
    echo -e "${GREEN}Variant $variant is ready for testing!${NC}"
    echo "Run 'yarn install && yarn start' to test locally"
    echo ""
}

# Function to build Docker image
build_docker() {
    local variant=$1
    echo -e "${YELLOW}Building Docker image for variant: $variant${NC}"
    
    # Navigate to the root directory
    cd ../../
    
    # Build the Docker image
    docker build -f micro-ui/web/docker/Dockerfile \
        --build-arg BUILD_VARIANT=$variant \
        -t digit-ui-$variant:local .
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Docker image built successfully: digit-ui-$variant:local${NC}"
    else
        echo -e "${RED}✗ Docker build failed for variant: $variant${NC}"
        return 1
    fi
    
    # Return to web directory
    cd micro-ui/web/
}

# Main menu
echo "Select an option:"
echo "1. Test core-ui variant locally"
echo "2. Test workbench-ui variant locally"
echo "3. Build core-ui Docker image"
echo "4. Build workbench-ui Docker image"
echo "5. Build all Docker images"
echo "6. Migrate packages from micro-ui-internals to packages"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        test_variant "core-ui"
        ;;
    2)
        test_variant "workbench-ui"
        ;;
    3)
        build_docker "core-ui"
        ;;
    4)
        build_docker "workbench-ui"
        ;;
    5)
        build_docker "core-ui"
        build_docker "workbench-ui"
        echo -e "${GREEN}All Docker images built!${NC}"
        ;;
    6)
        echo -e "${YELLOW}Running package migration script...${NC}"
        ./migrate-packages.sh
        ;;
    *)
        echo -e "${RED}Invalid choice. Please run the script again.${NC}"
        exit 1
        ;;
esac

echo ""
echo "Testing complete!"