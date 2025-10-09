#!/bin/bash

# Build script for DIGIT Elasticsearch Proxy

set -e

echo "========================================="
echo "Building DIGIT Elasticsearch Proxy"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "${BLUE}Working directory: $SCRIPT_DIR${NC}"

# Parse command line arguments
TAG="digit-elasticsearch-proxy:latest"
BUILD_CONTEXT="."
ELASTICSEARCH_URL="http://elasticsearch:9200"
KIBANA_URL="http://kibana:5601"
PUSH_IMAGE=false

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
        -p|--push)
            PUSH_IMAGE=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  -t, --tag <tag>                Docker image tag (default: digit-elasticsearch-proxy:latest)"
            echo "  -e, --elasticsearch <url>      Elasticsearch URL (default: http://elasticsearch:9200)"
            echo "  -k, --kibana <url>            Kibana URL (default: http://kibana:5601)"
            echo "  -p, --push                    Push image to registry after build"
            echo "  -h, --help                    Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                           # Build with defaults"
            echo "  $0 -t my-proxy:v1.0         # Build with custom tag"
            echo "  $0 -p                        # Build and push to registry"
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
echo "  Push to Registry: $PUSH_IMAGE"
echo ""

# Check if required files exist
if [ ! -f "$SCRIPT_DIR/server.js" ]; then
    echo -e "${RED}Error: server.js not found in $SCRIPT_DIR${NC}"
    exit 1
fi

if [ ! -f "$SCRIPT_DIR/package.json" ]; then
    echo -e "${RED}Error: package.json not found in $SCRIPT_DIR${NC}"
    exit 1
fi

if [ ! -f "$SCRIPT_DIR/Dockerfile" ]; then
    echo -e "${RED}Error: Dockerfile not found in $SCRIPT_DIR${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All required files found${NC}"

# Build the Docker image
echo -e "${YELLOW}Building Docker image...${NC}"
cd "$SCRIPT_DIR"

docker build \
    -t "$TAG" \
    --build-arg ELASTICSEARCH_URL="$ELASTICSEARCH_URL" \
    --build-arg KIBANA_URL="$KIBANA_URL" \
    .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Docker image built successfully: $TAG${NC}"
    
    # Show image size
    IMAGE_SIZE=$(docker images --format "table {{.Size}}" "$TAG" | tail -1)
    echo -e "${BLUE}Image size: $IMAGE_SIZE${NC}"
    
    echo ""
    echo "To run the proxy server:"
    echo ""
    echo -e "${BLUE}docker run -d \\"
    echo "  -p 3001:3001 \\"
    echo "  -e ELASTICSEARCH_URL=$ELASTICSEARCH_URL \\"
    echo "  -e KIBANA_URL=$KIBANA_URL \\"
    echo "  --name elasticsearch-proxy \\"
    echo "  $TAG${NC}"
    echo ""
    echo "Or use docker-compose:"
    echo -e "${BLUE}docker-compose up -d${NC}"
    
    # Test the image
    echo ""
    echo -e "${YELLOW}Testing the image...${NC}"
    CONTAINER_ID=$(docker run -d -p 3001:3001 "$TAG")
    sleep 5
    
    if curl -s http://localhost:3001/health > /dev/null; then
        echo -e "${GREEN}✓ Health check passed${NC}"
        docker stop "$CONTAINER_ID" > /dev/null
        docker rm "$CONTAINER_ID" > /dev/null
    else
        echo -e "${RED}✗ Health check failed${NC}"
        docker logs "$CONTAINER_ID"
        docker stop "$CONTAINER_ID" > /dev/null
        docker rm "$CONTAINER_ID" > /dev/null
        exit 1
    fi
    
    # Push to registry if requested
    if [ "$PUSH_IMAGE" = true ]; then
        echo ""
        echo -e "${YELLOW}Pushing image to registry...${NC}"
        docker push "$TAG"
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Image pushed successfully${NC}"
        else
            echo -e "${RED}✗ Failed to push image${NC}"
            exit 1
        fi
    fi
    
else
    echo -e "${RED}✗ Docker build failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Build completed successfully! 🎉${NC}"