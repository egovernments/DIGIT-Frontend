#!/bin/bash

# Build script for console app with Elasticsearch proxy support

set -e

echo "========================================="
echo "Building Console App with Proxy Support"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
WEB_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

echo -e "${YELLOW}Working directory: $WEB_DIR${NC}"

# Check if proxy files exist
if [ ! -f "$SCRIPT_DIR/proxy-server.js" ]; then
    echo -e "${RED}Error: proxy-server.js not found in $SCRIPT_DIR${NC}"
    exit 1
fi

if [ ! -f "$SCRIPT_DIR/proxy-package.json" ]; then
    echo -e "${RED}Error: proxy-package.json not found in $SCRIPT_DIR${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Proxy files found${NC}"

# Parse command line arguments
TAG="health-console:latest"
ELASTICSEARCH_URL="http://elasticsearch:9200"
KIBANA_URL="http://kibana:5601"

while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--tag)
            TAG="$2"
            shift 2
            ;;
        -e|--elasticsearch)
            ELASTICSEARCH_URL="$2"
            shift 2
            ;;
        -k|--kibana)
            KIBANA_URL="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  -t, --tag <tag>                Docker image tag (default: health-console:latest)"
            echo "  -e, --elasticsearch <url>      Elasticsearch URL (default: http://elasticsearch:9200)"
            echo "  -k, --kibana <url>            Kibana URL (default: http://kibana:5601)"
            echo "  -h, --help                    Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

echo ""
echo "Build Configuration:"
echo "  Image Tag: $TAG"
echo "  Elasticsearch URL: $ELASTICSEARCH_URL"
echo "  Kibana URL: $KIBANA_URL"
echo ""

# Build the Docker image
echo -e "${YELLOW}Building Docker image...${NC}"
cd "$WEB_DIR"

docker build \
    -f console/Dockerfile \
    -t "$TAG" \
    --build-arg WORK_DIR=./ \
    .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Docker image built successfully: $TAG${NC}"
    echo ""
    echo "To run the container:"
    echo ""
    echo "docker run -d \\"
    echo "  -p 8081:80 \\"
    echo "  -p 3002:3001 \\"
    echo "  -e ELASTICSEARCH_URL=$ELASTICSEARCH_URL \\"
    echo "  -e KIBANA_URL=$KIBANA_URL \\"
    echo "  $TAG"
    echo ""
    echo "Or use docker-compose:"
    echo "cd console && docker-compose up"
else
    echo -e "${RED}✗ Docker build failed${NC}"
    exit 1
fi