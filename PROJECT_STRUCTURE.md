# Login Page Microservices - Complete Project Structure

```
login-page-microservices/
├── README.md
├── docker-compose.yml                    # Local development orchestration
├── .gitignore
│
├── frontend/                            # React.js Frontend Application
│   ├── Dockerfile                       # Frontend container configuration
│   ├── nginx.conf                       # Nginx configuration for production
│   ├── package.json                     # Frontend dependencies
│   ├── public/
│   │   ├── index.html                   # Main HTML template
│   │   └── manifest.json                # PWA manifest
│   └── src/
│       ├── index.js                     # React app entry point
│       ├── index.css                    # Global styles
│       ├── App.js                       # Main app component with routing
│       ├── components/
│       │   ├── CourseCard.js            # Course display component
│       │   └── LoadingSpinner.js        # Loading indicator
│       ├── contexts/
│       │   └── AuthContext.js           # Authentication state management
│       ├── pages/
│       │   ├── LoginPage.js             # Login form with featured courses
│       │   ├── RegisterPage.js          # User registration form
│       │   ├── VerifyOTPPage.js         # OTP verification form
│       │   └── WelcomePage.js           # Post-login dashboard
│       └── services/
│           └── api.js                   # API service layer
│
├── services/                            # Backend Microservices
│   ├── user-service/                    # Authentication & User Management
│   │   ├── Dockerfile                   # User service container
│   │   ├── healthcheck.js               # Health check endpoint
│   │   ├── package.json                 # Dependencies
│   │   ├── server.js                    # Express server setup
│   │   ├── models/
│   │   │   └── User.js                  # User data model
│   │   ├── routes/
│   │   │   ├── auth.js                  # Authentication endpoints
│   │   │   └── users.js                 # User management endpoints
│   │   └── middleware/
│   │       └── auth.js                  # JWT authentication middleware
│   │
│   ├── course-service/                  # Course Data Management
│   │   ├── Dockerfile                   # Course service container
│   │   ├── healthcheck.js               # Health check endpoint
│   │   ├── package.json                 # Dependencies
│   │   ├── server.js                    # Express server setup
│   │   ├── models/
│   │   │   └── Course.js                # Course data model
│   │   ├── routes/
│   │   │   └── courses.js               # Course API endpoints
│   │   └── seedData.js                  # Sample course data
│   │
│   └── notification-service/            # Email & Notification Handling
│       ├── Dockerfile                   # Notification service container
│       ├── healthcheck.js               # Health check endpoint
│       ├── package.json                 # Dependencies
│       ├── server.js                    # Express server setup
│       ├── routes/
│       │   └── notifications.js         # Notification endpoints
│       └── services/
│           └── emailService.js          # Email sending logic
│
└── kubernetes/                          # Kubernetes Deployment Files
    └── deployment.yaml                  # Complete K8s deployment configuration
```

## Configuration Flow Explanation

### Local Development (Docker Compose)
```yaml
# Direct environment variable injection
environment:
  MONGODB_URI: mongodb://admin:password123@mongodb:27017/loginapp?authSource=admin
  JWT_SECRET: your-super-secret-jwt-key-change-in-production
  SMTP_USER: your-email@gmail.com
```

### Kubernetes Environment
```yaml
# ConfigMap for non-sensitive data
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  MONGODB_DATABASE: "loginapp"
  USER_SERVICE_URL: "http://user-service:3001"

# Secret for sensitive data
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  MONGODB_PASSWORD: cGFzc3dvcmQxMjM=  # base64 encoded

# Pod using both ConfigMap and Secret
env:
- name: MONGODB_DATABASE
  valueFrom:
    configMapKeyRef:
      name: app-config
      key: MONGODB_DATABASE
- name: MONGODB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: app-secrets
      key: MONGODB_PASSWORD
```

## Service Communication

### Local Development
- Services communicate via container names (e.g., `http://user-service:3001`)
- Docker Compose creates a default network for all services

### Kubernetes
- Services communicate via Kubernetes DNS (e.g., `http://user-service.login-microservices.svc.cluster.local:3001`)
- Simplified to `http://user-service:3001` within the same namespace
- LoadBalancer service exposes frontend externally
- ClusterIP services handle internal communication

## Security Considerations

### Secrets Management
1. **Local**: Environment variables in docker-compose.yml (not for production)
2. **Kubernetes**: Secrets stored in etcd, encrypted at rest
3. **Production**: Use external secret management (AWS Secrets Manager, HashiCorp Vault)

### Network Security
1. **Local**: All services on same Docker network
2. **Kubernetes**: Network policies can restrict inter-service communication
3. **Production**: Service mesh (Istio) for advanced traffic management