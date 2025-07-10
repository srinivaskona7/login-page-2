# Deployment Guide

## Prerequisites

### For Local Development
- Docker and Docker Compose installed
- Node.js 18+ (for local development without Docker)

### For Kubernetes Deployment
- Kubernetes cluster (minikube, kind, or cloud provider)
- kubectl configured to access your cluster
- Container registry access (Docker Hub, AWS ECR, etc.)

## Local Development Setup

### 1. Clone and Start Services
```bash
# Clone the repository
git clone <repository-url>
cd login-page-microservices

# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Access the Application
- Frontend: http://localhost:3000
- User Service: http://localhost:5001
- Course Service: http://localhost:5002
- Notification Service: http://localhost:5003
- MongoDB: localhost:27017

## Kubernetes Deployment

### 1. Build and Push Docker Images
```bash
# Build images for each service
docker build -t sriniv7654/busybox2:user-service ./services/user-service
docker build -t sriniv7654/busybox2:course-service ./services/course-service
docker build -t sriniv7654/busybox2:notification-service ./services/notification-service
docker build -t sriniv7654/busybox2:frontend ./frontend

# Push to registry
docker push sriniv7654/busybox2:user-service
docker push sriniv7654/busybox2:course-service
docker push sriniv7654/busybox2:notification-service
docker push sriniv7654/busybox2:frontend
```

### 2. Update Configuration
The deployment is already configured with the correct Docker Hub images:

```yaml
# Docker Hub images are already configured
image: sriniv7654/busybox2:user-service
image: sriniv7654/busybox2:course-service
image: sriniv7654/busybox2:notification-service
image: sriniv7654/busybox2:frontend

# Email credentials are already configured
SMTP_USER: parashuramuluchilukuri@gmail.com
SMTP_PASS: evbkbefxufpegdaq
```

### 3. Encode Secrets
The secrets are already base64 encoded in the deployment file:
- Email: `parashuramuluchilukuri@gmail.com`
- Password: `evbkbefxufpegdaq`
- Database: `root:mongodb-password`

### 4. Deploy to Kubernetes
```bash
# Apply the complete deployment
kubectl apply -f kubernetes/complete-deployment.yaml

# Check deployment status
kubectl get pods -n login-microservices
kubectl get services -n login-microservices

# View logs
kubectl logs -f deployment/user-service -n login-microservices
kubectl logs -f deployment/course-service -n login-microservices
kubectl logs -f deployment/notification-service -n login-microservices
kubectl logs -f deployment/frontend -n login-microservices
```

### 5. Access the Application

#### Using LoadBalancer (Cloud Provider)
```bash
# Get external IP
kubectl get service frontend -n login-microservices
# Access via the EXTERNAL-IP
```

#### Using Ingress (with Ingress Controller)
```bash
# Install nginx ingress controller (if not already installed)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Add to /etc/hosts (for local testing)
echo "$(kubectl get ingress login-app-ingress -n login-microservices -o jsonpath='{.status.loadBalancer.ingress[0].ip}') login-app.local" >> /etc/hosts

# Access via http://login-app.local
```

#### Using Port Forward (Development)
```bash
# Forward frontend port
kubectl port-forward service/frontend 8080:80 -n login-microservices

# Access via http://localhost:8080
```

## Configuration Management

### ConfigMaps (Non-sensitive data)
```bash
# View current config
kubectl get configmap app-config -n login-microservices -o yaml

# Update config
kubectl edit configmap app-config -n login-microservices
```

### Secrets (Sensitive data)
```bash
# View current secrets (values are base64 encoded)
kubectl get secret app-secrets -n login-microservices -o yaml

# Update secrets
kubectl edit secret app-secrets -n login-microservices

# Or create new secret
kubectl create secret generic app-secrets \
  --from-literal=MONGODB_PASSWORD=password123 \
  --from-literal=JWT_SECRET=your-jwt-secret \
  --from-literal=SMTP_USER=your-email@gmail.com \
  --from-literal=SMTP_PASS=your-app-password \
  --from-literal=FROM_EMAIL=your-email@gmail.com \
  -n login-microservices
```

## Monitoring and Troubleshooting

### Health Checks
```bash
# Check pod health
kubectl get pods -n login-microservices

# Describe problematic pods
kubectl describe pod <pod-name> -n login-microservices

# Check service endpoints
kubectl get endpoints -n login-microservices
```

### Logs
```bash
# View logs for specific service
kubectl logs -f deployment/user-service -n login-microservices

# View logs for all containers in a pod
kubectl logs -f <pod-name> --all-containers -n login-microservices

# View previous container logs (if crashed)
kubectl logs <pod-name> --previous -n login-microservices
```

### Scaling
```bash
# Manual scaling
kubectl scale deployment user-service --replicas=5 -n login-microservices

# Check HPA status
kubectl get hpa -n login-microservices

# View HPA details
kubectl describe hpa user-service-hpa -n login-microservices
```

## Security Considerations

### Production Recommendations
1. **Use external secret management** (AWS Secrets Manager, HashiCorp Vault)
2. **Enable RBAC** for fine-grained access control
3. **Use Network Policies** to restrict inter-pod communication
4. **Enable Pod Security Standards**
5. **Use TLS/SSL** for all external communications
6. **Regular security updates** for base images
7. **Implement monitoring and alerting**

### Example External Secret Management
```yaml
# Using External Secrets Operator with AWS Secrets Manager
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-secrets-manager
  namespace: login-microservices
spec:
  provider:
    aws:
      service: SecretsManager
      region: us-west-2
      auth:
        jwt:
          serviceAccountRef:
            name: external-secrets-sa
```

## Cleanup

### Remove from Kubernetes
```bash
# Delete all resources
kubectl delete -f kubernetes/complete-deployment.yaml

# Or delete namespace (removes everything)
kubectl delete namespace login-microservices
```

### Stop Local Development
```bash
# Stop Docker Compose
docker-compose down

# Remove volumes (optional - will delete database data)
docker-compose down -v
```