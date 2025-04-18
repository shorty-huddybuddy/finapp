# FinApp Project - README

## Overview

FinApp is a comprehensive financial application that combines investment tracking, educational resources, and market data analytics to help users make informed financial decisions.

## Project Structure
finapp/
├── frontend/                   # Next.js frontend application
│   ├── src/
│   │   ├── app/                # Next.js app router routes
│   │   │   └── stock-dashboard/# Stock dashboard page
│   │   ├── components/         # Reusable React components
│   │   │   ├── ui/             # UI components (cards, tabs, etc.)
│   │   │   ├── *-widget.tsx    # TradingView widget integrations
│   │   │   └── ...
│   │   ├── constants/          # Application constants
│   │   │   └── education.ts    # Educational content data
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── store.ts        # Transaction state management
│   │   ├── lib/                # Utility functions
│   │   └── types/              # TypeScript type definitions
│   ├── public/                 # Static assets
│   ├── cloudbuild.yaml         # Google Cloud Build configuration
│   └── next.config.ts          # Next.js configuration
│
└── backend/                    # Go backend application
    ├── config/                 # Configuration setup
    │   └── ...                 # Stripe and other service configs
    ├── database/               # Database integration
    │   └── ...                 # Firebase initialization
    ├── routes/                 # API route handlers
    │   └── ...
    └── main.go                 # Main application entry point



## Features

- **Stock Dashboard**: Real-time market data and stock tracking
- **Financial Analytics**: Visualize spending patterns and savings rate
- **Education Center**: Comprehensive financial literacy resources
- **Market Overview**: Live market indicators and trends

## Technology Stack

- **Frontend**:
    
    - Next.js (React framework)
    - TypeScript
    - TradingView widgets for market data visualization
    - Recharts for data visualization
- **Backend**:
    
    - Go (Golang)
    - Fiber web framework
    - Firebase for database
    - Stripe for payment processing



## Environment Variables

The application uses various environment variables for API keys and service configuration:

- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_ML_API_URL`: Machine learning recommendation service URL
- `NEXT_PUBLIC_MARKET_DATA_URL`: Market data API URL
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe public key
- `CLERK_SECRET_KEY`: Clerk authentication key


## Getting Started

1.**Clone the repository**
```
git clone <repository-url>

cd finapp
```

2.**Frontend setup**

```
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 to view the application.

3.**Backend setup**

```
cd backend
go mod download
go run main.go
```

Backend will start on the configured port (default: 8080).


## Deployment

- Frontend is configured for deployment using Google Cloud Build
- Backend can be deployed to Google Cloud Run or similar container services
