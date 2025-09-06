# 📊 Finaura – GenAI-Powered Financial Assistant

Finaura is an AI-powered financial assistant that simplifies investment planning, portfolio management, and financial education. It empowers users with real-time insights, personalized suggestions, and smart financial tools — all in one seamless platform.

---

## 🚩 Problem Statement

In today’s dynamic financial landscape, individuals often face:
- Information overload
- Lack of trustworthy investment advice
- Low financial literacy
- Difficulty managing personal finances

**Finaura** aims to bridge this gap with automation, education, and GenAI.

---

## 🌟 Key Features

### 🧠 AI-Powered Insights
- **Portfolio Evaluation** – Get BUY/HOLD/SELL actions
- **Risk Profiling** – Classify users as Low, Medium, or High risk
- **Smart Recommendations** – Tailored investment options
- **Market Trends** – AI-curated financial news and analysis

### 💬 TradeMate Chatbot
- Get instant answers to financial questions
- Investment suggestions and general help via GenAI

### 🎓 Financial Education Hub
- Blogs, videos, and micro-courses for every level

### 📅 Financial Calendar
- Track EMIs, tax deadlines, and investment reminders

### 📈 Market Monitoring
- Real-time asset tracking, personalized watchlists

### 🤝 Social Trading
- Follow top traders
- Learn strategies from experienced investors

### 💸 Pay-to-Earn Model
- Earn rewards for using features, completing tasks, and referring users

---

## 🧰 Tech Stack

| Layer        | Technology      |
|--------------|-----------------|
| Frontend     | Next.js         |
| Backend      | Go (Golang) /Python    |
| Database     | Firebase        |
| AI/LLM       | Gemini API/Models |

---

## 🚀 Business Model

- **Freemium**: Core features available for free
- **Premium**: Advanced analytics, premium social trading
- **Pay-to-Earn**: Incentives for education, referrals, and engagement

---

## 📽️ Demo

Watch the 3-minute product demo: https://www.youtube.com/watch?v=E2v8UEyJjDU

---

## Project Structure
```
/finapp/
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
```



## Environment Variables

The application uses various environment variables for API keys and service configuration:

- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_ML_API_URL`: Machine learning recommendation service URL
- `NEXT_PUBLIC_MARKET_DATA_URL`: Market data API URL
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe public key
- `CLERK_SECRET_KEY`: Clerk authentication key




## 📌 Getting Started (for Developers)

```bash
# 1. Clone the repository
git clone https://github.com/Karansenpai/finapp
```

# 2. Navigate to the project
```bash
cd finaura
```

# 3. Set up environment variables

# In Frontend
    - Clerk_secret_key
# In Backend
    - api_key.json (Firebase key)
    - .env ( Stripe key , Clerk key)
    - Gemini Api key


# 4. Install frontend dependencies
npm install

# 5. Run the frontend
npm run dev

# 6. Start the backend (Go)
```bash
cd backend
go mod tidy
go run main.go
```
#7. Start the Python Server
```bash
pip install -r requrements.txt
uvicorn app:app --reload
```

UI ScreenShots

![image](https://github.com/user-attachments/assets/077bc3b0-5ed3-4098-941d-7caefcbb78c9)
![image](https://github.com/user-attachments/assets/cb36c013-13df-457e-ae5c-ed703754c4c8)
![image](https://github.com/user-attachments/assets/1d8194ab-d1b4-47df-8fec-672da6a77159)
![image](https://github.com/user-attachments/assets/89796cc6-d2ab-47de-9002-c487835f84df)
![image](https://github.com/user-attachments/assets/0511be0e-8f8f-4c7c-88d0-71404e4f29de)
![image](https://github.com/user-attachments/assets/262c94f4-3749-487c-b51c-01a670d71f81)
![image](https://github.com/user-attachments/assets/91b19b71-de09-42bc-b063-bd83a867d151)

