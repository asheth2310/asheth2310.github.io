# Real-Time Analytics Platform

A serverless data processing pipeline with a live monitoring dashboard using AWS Lambda, DynamoDB, React, and WebSockets.

## Features
- Serverless event ingestion via AWS Lambda
- DynamoDB for high-throughput storage
- Real-time WebSocket dashboard
- Sub-500ms average latency
- Cost-effective cloud-native architecture

## Tech Stack
- **Backend:** Python, AWS Lambda, DynamoDB
- **Frontend:** React, WebSockets
- **Infrastructure:** AWS (Lambda, API Gateway, DynamoDB)

## Architecture

```
Events → API Gateway → Lambda → DynamoDB
                                    ↓
                          WebSocket API Gateway
                                    ↓
                            React Dashboard
```

## Getting Started

### Local Development
```bash
# Backend (local simulation)
cd backend
pip install -r requirements.txt
python server.py

# Frontend
cd frontend
npm install
npm run dev
```

### Deploy to AWS
```bash
cd infrastructure
pip install aws-sam-cli
sam build
sam deploy --guided
```

## Performance
- Processes high-volume events daily
- Sub-500ms average latency
- Query optimization reduced response time from 2.7s to 1.1s
