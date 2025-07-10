#!/bin/bash

# Build and Push Script for Login Page Microservices
# This script builds all Docker images with multi-stage builds and pushes them to Docker Hub

set -e  # Exit on any error

# Configuration
REGISTRY="sriniv7654/busybox2"
VERSION="v1.0.0"
LATEST_TAG="latest"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Services to build
SERVICES=("user-service" "course-service" "notification-service" "frontend")

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to check if logged into Docker Hub
check_docker_login() {
    if ! docker info | grep -q "Username"; then
        print_warning "Not logged into Docker Hub. Attempting to login..."
        docker login
    fi
    print_success "Docker Hub login verified"
}

# Function to build and push a service
build_and_push_service() {
    local service=$1
    local service_dir=""
    
    print_status "Building $service..."
    
    # Determine service directory
    if [ "$service" = "frontend" ]; then
        service_dir="frontend"
    else
        service_dir="services/$service"
    fi
    
    # Check if directory exists
    if [ ! -d "$service_dir" ]; then
        print_error "Directory $service_dir does not exist"
        return 1
    fi
    
    # Navigate to service directory
    cd "$service_dir"
    
    # Check if Dockerfile exists
    if [ ! -f "Dockerfile" ]; then
        print_error "Dockerfile not found in $service_dir"
        cd - > /dev/null
        return 1
    fi
    
    # Build image with multi-stage support
    print_status "Building Docker image for $service..."
    if docker build -t "$REGISTRY:$service" -t "$REGISTRY:$service-$VERSION" .; then
        print_success "Successfully built $service"
    else
        print_error "Failed to build $service"
        cd - > /dev/null
        return 1
    fi
    
    # Push images to registry
    print_status "Pushing $service to Docker Hub..."
    if docker push "$REGISTRY:$service" && docker push "$REGISTRY:$service-$VERSION"; then
        print_success "Successfully pushed $service"
    else
        print_error "Failed to push $service"
        cd - > /dev/null
        return 1
    fi
    
    # Return to root directory
    cd - > /dev/null
    
    print_success "$service build and push completed"
    echo ""
}

# Function to show image sizes
show_image_info() {
    print_status "Docker image information:"
    echo ""
    for service in "${SERVICES[@]}"; do
        if docker images "$REGISTRY:$service" --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" | grep -v "REPOSITORY"; then
            echo ""
        fi
    done
}

# Function to cleanup old images (optional)
cleanup_old_images() {
    read -p "Do you want to cleanup old/dangling images? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up dangling images..."
        docker image prune -f
        print_success "Cleanup completed"
    fi
}

# Function to verify images
verify_images() {
    print_status "Verifying pushed images..."
    for service in "${SERVICES[@]}"; do
        if docker manifest inspect "$REGISTRY:$service" > /dev/null 2>&1; then
            print_success "$service image verified on Docker Hub"
        else
            print_error "$service image verification failed"
        fi
    done
}

# Main execution
main() {
    echo "🚀 Building and pushing Login Page Microservices"
    echo "================================================"
    echo ""
    
    # Pre-flight checks
    check_docker
    check_docker_login
    
    # Show configuration
    print_status "Configuration:"
    echo "  Registry: $REGISTRY"
    echo "  Version: $VERSION"
    echo "  Services: ${SERVICES[*]}"
    echo ""
    
    # Confirm before proceeding
    read -p "Do you want to proceed with building and pushing all services? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Operation cancelled by user"
        exit 0
    fi
    
    # Build and push each service
    failed_services=()
    for service in "${SERVICES[@]}"; do
        if ! build_and_push_service "$service"; then
            failed_services+=("$service")
        fi
    done
    
    echo "================================================"
    
    # Show results
    if [ ${#failed_services[@]} -eq 0 ]; then
        print_success "🎉 All services built and pushed successfully!"
        show_image_info
        verify_images
        cleanup_old_images
    else
        print_error "❌ Some services failed to build/push:"
        for service in "${failed_services[@]}"; do
            echo "  - $service"
        done
        exit 1
    fi
    
    echo ""
    print_status "Next steps:"
    echo "  1. Deploy to Kubernetes: kubectl apply -f kubernetes/complete-deployment.yaml"
    echo "  2. Check deployment: kubectl get pods -n login-microservices"
    echo "  3. Access application: kubectl port-forward service/frontend 8080:80 -n login-microservices"
}

# Handle script interruption
trap 'print_error "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@"