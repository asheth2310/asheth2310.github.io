# E-Commerce Microservices Platform

A scalable distributed e-commerce system with 5 microservices handling user management, inventory, orders, and payments.

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User Svc  │    │ Inventory   │    │  Order Svc  │
│  :8001      │    │  Svc :8002  │    │  :8003      │
└─────────────┘    └─────────────┘    └─────────────┘
       │                  │                  │
       └──────────────────┴──────────────────┘
                          │
                    Apache Kafka
                          │
       ┌──────────────────┴──────────────────┐
       │                                     │
┌─────────────┐                    ┌─────────────────┐
│ Payment Svc │                    │ Notification Svc│
│  :8004      │                    │  :8005          │
└─────────────┘                    └─────────────────┘
```

## Tech Stack
- **Language:** Java 17, Spring Boot 3
- **Messaging:** Apache Kafka
- **Database:** PostgreSQL (per service)
- **Infrastructure:** Docker, AWS EC2
- **CI/CD:** Jenkins

## Services
| Service | Port | Description |
|---------|------|-------------|
| user-service | 8001 | Auth, registration, profiles |
| inventory-service | 8002 | Product catalog, stock management |
| order-service | 8003 | Order lifecycle management |
| payment-service | 8004 | Payment processing |
| notification-service | 8005 | Event-driven notifications |

## Getting Started

```bash
docker-compose up --build
```

## API Coverage
83% code coverage via automated unit and integration tests.
