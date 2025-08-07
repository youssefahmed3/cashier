# Cashier - Multi-Tenant Point of Sale System

A comprehensive, microservices-based Point of Sale (POS) system designed for multi-tenant retail operations. This system combines .NET and Spring Boot services with a modern Next.js frontend, providing a scalable and robust solution for retail businesses.

## 🏗 Architecture Overview

The system follows a microservices architecture pattern with the following components:

### Backend Services
- *Authentication & User Management* (.NET 9.0)
- *Order Management* (.NET 9.0)
- *Inventory Management* (Spring Boot 3.2.5)
- *Catalog Management* (Spring Boot 3.2.5)
- *Tenant Management* (Spring Boot 3.2.5)
- *Notification Service* (Spring Boot 3.2.5)
- *Receipt Service* (.NET 9.0)
- *Shift Management* (.NET 9.0)
- *Subscription Service* (.NET 9.0)
- *Reporting Service* (.NET 9.0)

### Frontend
- *Next.js 15.3.5* with React 19
- *TypeScript* for type safety
- *Tailwind CSS* for styling
- *Radix UI* components
- *React Query* for state management

### Infrastructure
- *Traefik* as API Gateway
- *RabbitMQ* for message queuing
- *PostgreSQL* for Spring Boot services
- *SQL Server* for .NET services
- *Docker* for containerization

## 🚀 Quick Start

### Prerequisites

- *Docker & Docker Compose*
- *Node.js 18+* (for local frontend development)
- *.NET 9.0 SDK* (for local .NET development)
- *Java 17+* (for local Spring Boot development)
- *Maven 3.6+* (for Spring Boot services)

### Environment Setup

1. *Clone the repository*
   bash
   git clone <repository-url>
   cd cashier
   

2. *Set up environment variables*
   Create a .env file in the root directory:
   env
   # Database Configuration
   NOTIFICATION_POSTGRES_DB=notification_db
   NOTIFICATION_POSTGRES_USER=notification_user
   NOTIFICATION_POSTGRES_PASSWORD=notification_pass
   
   # JWT Configuration
   JWT_SECRET=your-secret-key-here
   JWT_ISSUER=https://localhost:7192
   JWT_AUDIENCE=https://localhost:3000
   
   # Service URLs
   SPRING_PROFILES_ACTIVE=dev
   SUBSCRIPTION_SERVICE_URL=http://subscription-service:8080
   

3. *Start the entire system with Docker Compose*
   bash
   cd docker
   docker-compose up -d
   

### Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Traefik Dashboard | 8080 | API Gateway Dashboard |
| Frontend | 3000 | Next.js Application |
| Auth Service | 8001 | Authentication & User Management |
| Order Service | 8002 | Order Management |
| Notification Service | 8003 | Notification Management |
| Tenant Service | 8004 | Tenant & Branch Management |
| Catalog Service | 8005 | Product Catalog |
| Receipt Service | 8006 | Receipt Generation |
| Inventory Service | 8008 | Inventory Management |
| Shift Service | 8011 | Shift Management |
| Subscription Service | 7221 | Subscription Management |
| Reporting Service | 7144 | Reporting & Analytics |

### Database Ports

| Database | Port | Type |
|----------|------|------|
| Auth DB | 1434 | SQL Server |
| Order DB | 1433 | SQL Server |
| Notification DB | 5433 | PostgreSQL |
| Catalog DB | 5435 | PostgreSQL |
| Inventory DB | 5437 | PostgreSQL |
| Tenant DB | 5436 | PostgreSQL |

## 🔧 Development Setup

### Frontend Development

bash
cd frontend
npm install
npm run dev


The frontend will be available at http://localhost:3000

### Backend Development

#### .NET Services
bash
cd backend/dotnet-services/[ServiceName]
dotnet restore
dotnet run


#### Spring Boot Services
bash
cd backend/springboot-services/[service-name]
mvn clean install
mvn spring-boot:run


## 📚 API Documentation

Each service provides its own API documentation:

- *Auth Service*: http://localhost:8001/swagger
- *Order Service*: http://localhost:8002/swagger
- *Tenant Service*: http://localhost:8004/swagger-ui.html
- *Inventory Service*: http://localhost:8008/swagger-ui.html
- *Catalog Service*: http://localhost:8005/swagger-ui.html
- *Notification Service*: http://localhost:8003/swagger-ui.html

## 🏢 Multi-Tenant Architecture

The system supports multi-tenancy with the following features:

- *Tenant Isolation*: Each tenant has isolated data and configurations
- *Branch Management*: Support for multiple branches per tenant
- *Role-Based Access Control*: Granular permissions per user role
- *Subscription Management*: Flexible subscription plans and billing

## 🔐 Authentication & Authorization

- *JWT-based authentication* with centralized token validation
- *Role-based access control* with granular permissions
- *Two-factor authentication* support
- *Password reset* functionality
- *Session management* with secure token handling

## 💳 Payment Integration

The system supports multiple payment methods:

- *Cash payments*
- *Paymob integration* for online payments
- *Refund processing*
- *Payment event publishing* via RabbitMQ

## 📊 Features

### Core POS Features
- *Order Management*: Create, modify, and track orders
- *Inventory Management*: Real-time stock tracking and alerts
- *Catalog Management*: Product catalog with categories and variants
- *Receipt Generation*: Customizable receipt templates
- *Shift Management*: Cashier shift tracking and reporting

### Business Intelligence
- *Reporting Service*: Comprehensive business analytics
- *Real-time Dashboards*: Live business metrics
- *Export Capabilities*: Data export in multiple formats

### Communication
- *Notification Service*: Email and in-app notifications
- *Event-Driven Architecture*: Real-time updates via RabbitMQ
- *Webhook Support*: External system integrations

## 🐳 Docker Configuration

The system uses Docker Compose for orchestration with the following services:

- *Traefik*: API Gateway with automatic service discovery
- *RabbitMQ*: Message broker for inter-service communication
- *PostgreSQL*: Database for Spring Boot services
- *SQL Server*: Database for .NET services
- *All Microservices*: Containerized applications

## 🔄 Message Queue (RabbitMQ)

RabbitMQ is used for:
- *Event-driven communication* between services
- *Payment event publishing*
- *Notification delivery*
- *Inventory updates*
- *Order status changes*

Access RabbitMQ Management Console at: http://localhost:15672
- Username: guest
- Password: guest

## 🧪 Testing

### Frontend Testing
bash
cd frontend
npm run test


### Backend Testing

#### .NET Services
bash
cd backend/dotnet-services/[ServiceName]
dotnet test


#### Spring Boot Services
bash
cd backend/springboot-services/[service-name]
mvn test


## 📦 Deployment

### Production Deployment

1. *Build Docker images*
   bash
   docker-compose build
   

2. *Deploy with Docker Compose*
   bash
   docker-compose -f docker-compose.prod.yml up -d
   

3. *Database migrations*
   bash
   # .NET services auto-migrate on startup
   # Spring Boot services use JPA auto-update
   

### Environment Variables for Production

Create a .env.production file with production-specific values:
env
# Production Database URLs
SPRING_NOTIFICATION_DATASOURCE_URL=jdbc:postgresql://prod-db:5432/notification_db
# ... other production configurations


## 🔍 Monitoring & Health Checks

- *Actuator endpoints* for Spring Boot services
- *Health checks* for all Docker containers
- *Traefik dashboard* for API gateway monitoring
- *RabbitMQ management* for message queue monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation for each service

## 🔄 Version History

- *v1.0.0*: Initial release with core POS functionality
- *v1.1.0*: Added multi-tenant support
- *v1.2.0*: Enhanced reporting and analytics
- *v1.3.0*: Payment integration and receipt generation

---
