# Login Page Microservices Application

A complete full-stack web application built with microservices architecture, featuring user authentication, course management, and email notifications.

## 🏗️ Architecture Overview

This application demonstrates modern microservices patterns with:

- **Frontend**: React.js SPA with responsive design
- **Backend Services**: 
  - User Service (Authentication & User Management)
  - Course Service (Course Data Management) 
  - Notification Service (Email/OTP Handling)
- **Database**: MongoDB with proper indexing
- **Containerization**: Multi-stage Docker builds
- **Orchestration**: Docker Compose + Kubernetes

## 🚀 Features

### User Authentication Flow
- ✅ User Registration with email verification
- ✅ OTP-based email verification
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Account lockout after failed attempts

### Course Management
- ✅ Featured courses display
- ✅ Course filtering and search
- ✅ Category-based organization
- ✅ Rating and enrollment tracking

### Technical Features
- ✅ Microservices architecture
- ✅ Multi-stage Docker builds
- ✅ Kubernetes deployment ready
- ✅ Health checks and monitoring
- ✅ Horizontal pod autoscaling
- ✅ Security best practices

## 📁 Project Structure

```
login-page-microservices/
├── README.md
├── docker-compose.yml
├── .gitignore
│
├── frontend/                     # React.js Frontend
│   ├── Dockerfile               # Multi-stage build
│   ├── nginx.conf               # Production config
│   ├── package.json
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       └── services/
│
├── services/                     # Backend Microservices
│   ├── user-service/            # Authentication & Users
│   │   ├── Dockerfile           # Multi-stage build
│   │   ├── package.json
│   │   ├── server.js
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   │
│   ├── course-service/          # Course Management
│   │   ├── Dockerfile           # Multi-stage build
│   │   ├── package.json
│   │   ├── server.js
│   │   ├── models/
│   │   └── routes/
│   │
│   └── notification-service/    # Email Notifications
│       ├── Dockerfile           # Multi-stage build
│       ├── package.json
│       ├── server.js
│       ├── routes/
│       └── services/
│
└── kubernetes/                   # K8s Deployment
    └── complete-deployment.yaml # Single file deployment
```

## 🛠️ Development Setup

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- kubectl (for Kubernetes deployment)

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd login-page-microservices
```

2. **Start all services**
```bash
docker-compose up -d
```

3. **View logs**
```bash
docker-compose logs -f
```

4. **Access the application**
- Frontend: http://localhost:3000
- User Service: http://localhost:5001
- Course Service: http://localhost:5002
- Notification Service: http://localhost:5003

## 🐳 Docker Build & Push Guide

### Building Individual Services

#### 1. User Service
```bash
# Navigate to user service directory
cd services/user-service

# Build multi-stage Docker image
docker build -t sriniv7654/busybox2:user-service .

# Tag for different versions
docker tag sriniv7654/busybox2:user-service sriniv7654/busybox2:user-service-v1.0.0

# Push to Docker Hub
docker push sriniv7654/busybox2:user-service
docker push sriniv7654/busybox2:user-service-v1.0.0
```

#### 2. Course Service
```bash
# Navigate to course service directory
cd services/course-service

# Build multi-stage Docker image
docker build -t sriniv7654/busybox2:course-service .

# Tag for different versions
docker tag sriniv7654/busybox2:course-service sriniv7654/busybox2:course-service-v1.0.0

# Push to Docker Hub
docker push sriniv7654/busybox2:course-service
docker push sriniv7654/busybox2:course-service-v1.0.0
```

#### 3. Notification Service
```bash
# Navigate to notification service directory
cd services/notification-service

# Build multi-stage Docker image
docker build -t sriniv7654/busybox2:notification-service .

# Tag for different versions
docker tag sriniv7654/busybox2:notification-service sriniv7654/busybox2:notification-service-v1.0.0

# Push to Docker Hub
docker push sriniv7654/busybox2:notification-service
docker push sriniv7654/busybox2:notification-service-v1.0.0
```

#### 4. Frontend Service
```bash
# Navigate to frontend directory
cd frontend

# Build multi-stage Docker image
docker build -t sriniv7654/busybox2:frontend .

# Tag for different versions
docker tag sriniv7654/busybox2:frontend sriniv7654/busybox2:frontend-v1.0.0

# Push to Docker Hub
docker push sriniv7654/busybox2:frontend
docker push sriniv7654/busybox2:frontend-v1.0.0
```

### Build All Services (Automated Script)

Create a build script `build-and-push.sh`:

```bash
#!/bin/bash

# Set variables
REGISTRY="sriniv7654/busybox2"
VERSION="v1.0.0"

# Services to build
SERVICES=("user-service" "course-service" "notification-service" "frontend")

echo "🚀 Building and pushing all microservices..."

# Build and push each service
for service in "${SERVICES[@]}"; do
    echo "📦 Building $service..."
    
    if [ "$service" = "frontend" ]; then
        cd frontend
    else
        cd services/$service
    fi
    
    # Build image
    docker build -t $REGISTRY:$service .
    docker tag $REGISTRY:$service $REGISTRY:$service-$VERSION
    
    # Push to registry
    echo "🚢 Pushing $service to Docker Hub..."
    docker push $REGISTRY:$service
    docker push $REGISTRY:$service-$VERSION
    
    echo "✅ $service build and push completed"
    
    # Return to root directory
    cd - > /dev/null
done

echo "🎉 All services built and pushed successfully!"
```

Make it executable and run:
```bash
chmod +x build-and-push.sh
./build-and-push.sh
```

### Docker Build Optimization Tips

1. **Use .dockerignore files** in each service directory:
```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.coverage
.cache
```

2. **Build with BuildKit** for better performance:
```bash
export DOCKER_BUILDKIT=1
docker build -t sriniv7654/busybox2:user-service .
```

3. **Build with specific platform** for multi-arch support:
```bash
docker buildx build --platform linux/amd64,linux/arm64 \
  -t sriniv7654/busybox2:user-service --push .
```

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (minikube, kind, or cloud provider)
- kubectl configured
- Docker images pushed to registry

### Deploy to Kubernetes

1. **Apply the deployment**
```bash
kubectl apply -f kubernetes/complete-deployment.yaml
```

2. **Check deployment status**
```bash
# Check pods
kubectl get pods -n login-microservices

# Check services
kubectl get services -n login-microservices

# Check ingress
kubectl get ingress -n login-microservices
```

3. **View logs**
```bash
kubectl logs -f deployment/user-service -n login-microservices
kubectl logs -f deployment/course-service -n login-microservices
kubectl logs -f deployment/notification-service -n login-microservices
kubectl logs -f deployment/frontend -n login-microservices
```

### Access the Application

#### Option 1: LoadBalancer (Cloud Provider)
```bash
# Get external IP
kubectl get service frontend -n login-microservices
# Access via EXTERNAL-IP
```

#### Option 2: Port Forward (Development)
```bash
kubectl port-forward service/frontend 8080:80 -n login-microservices
# Access via http://localhost:8080
```

#### Option 3: Ingress (with Ingress Controller)
```bash
# Install nginx ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Add to /etc/hosts
echo "$(kubectl get ingress login-app-ingress -n login-microservices -o jsonpath='{.status.loadBalancer.ingress[0].ip}') login-app.local" >> /etc/hosts

# Access via http://login-app.local
```

## 🔧 Configuration

### Environment Variables

#### Local Development (docker-compose.yml)
```yaml
environment:
  MONGO_URI: mongodb://root:mongodb-password@mongo:27017/your_db_name?authSource=admin
  JWT_SECRET: your-super-secret-jwt-key-change-in-production
  SMTP_USER: parashuramuluchilukuri@gmail.com
  SMTP_PASS: evbkbefxufpegdaq
```

#### Kubernetes (ConfigMaps & Secrets)
```yaml
# ConfigMap for non-sensitive data
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  MONGODB_DATABASE: "your_db_name"
  SMTP_HOST: "smtp.gmail.com"

# Secret for sensitive data
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  MONGODB_PASSWORD: bW9uZ29kYi1wYXNzd29yZA==  # base64 encoded
  SMTP_PASS: ZXZia2JlZnh1ZnBlZ2RhcQ==  # base64 encoded
```

## 🔍 Monitoring & Troubleshooting

### Health Checks
```bash
# Check all pods
kubectl get pods -n login-microservices

# Describe problematic pods
kubectl describe pod <pod-name> -n login-microservices

# Check service endpoints
kubectl get endpoints -n login-microservices
```

### Scaling
```bash
# Manual scaling
kubectl scale deployment user-service --replicas=5 -n login-microservices

# Check HPA status
kubectl get hpa -n login-microservices
```

### Logs
```bash
# View logs for specific service
kubectl logs -f deployment/user-service -n login-microservices

# View previous container logs (if crashed)
kubectl logs <pod-name> --previous -n login-microservices
```

## 🔒 Security Features

- ✅ Multi-stage Docker builds (smaller attack surface)
- ✅ Non-root user containers
- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on all services
- ✅ CORS configuration
- ✅ Helmet.js security headers
- ✅ Input validation with Joi
- ✅ Account lockout mechanism
- ✅ Kubernetes secrets for sensitive data
- ✅ Network policies for pod communication

## 🧪 Testing

### Local Testing
```bash
# Test user registration
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'

# Test course retrieval
curl http://localhost:5002/api/courses/featured
```

### Kubernetes Testing
```bash
# Port forward for testing
kubectl port-forward service/user-service 5001:5001 -n login-microservices

# Test endpoints
curl http://localhost:5001/health
```

## 📊 Performance Considerations

### Docker Optimizations
- Multi-stage builds reduce image size by ~60%
- Package lock files ensure consistent dependencies
- Production-only dependencies in final stage
- Layer caching for faster rebuilds

### Kubernetes Optimizations
- Horizontal Pod Autoscaling (HPA) configured
- Resource requests and limits set
- Readiness and liveness probes
- Multiple replicas for high availability

## 🚀 Production Deployment Checklist

- [ ] Update all default passwords and secrets
- [ ] Configure external secret management (AWS Secrets Manager, Vault)
- [ ] Set up monitoring and alerting (Prometheus, Grafana)
- [ ] Configure log aggregation (ELK stack, Fluentd)
- [ ] Enable TLS/SSL certificates
- [ ] Set up backup strategy for MongoDB
- [ ] Configure CI/CD pipeline
- [ ] Implement security scanning
- [ ] Set up disaster recovery plan
- [ ] Configure network policies
- [ ] Enable pod security standards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the deployment logs

---

**Built with ❤️ using modern microservices architecture**