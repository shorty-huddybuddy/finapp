# 🚀 SETUP GUIDE - Finaura Financial Assistant

## 📋 Required API Keys Summary

### ✅ FREE APIS (All have free tiers)

1. **Clerk** (Authentication) - FREE
   - 🔗 https://clerk.com/
   - Free tier: 10,000 Monthly Active Users
   - Required for user authentication

2. **Stripe** (Payments) - FREE for testing
   - 🔗 https://stripe.com/
   - Test mode is completely free
   - Required for subscription features

3. **Google Gemini** (AI) - FREE
   - 🔗 https://makersuite.google.com/app/apikey
   - Free tier: 60 requests per minute
   - Required for AI chatbot and analysis

4. **Firebase** (Database) - FREE
   - 🔗 https://console.firebase.google.com/
   - Free Spark plan available
   - Required for data storage

5. **Finnhub** (Stock Data) - FREE
   - 🔗 https://finnhub.io/
   - Free tier: 60 API calls/minute
   - Required for stock price data

6. **Market Data API** - FREE (already configured with demo key)
   - 🔗 https://www.marketdata.app/
   - Already has a demo key in the code
   - Optional: Get your own key for higher limits

---

## 🛠️ Step-by-Step Setup

### 1️⃣ Prerequisites

Check if you have the required tools installed:

```powershell
# Check Node.js (Required: v18+)
node --version

# Check Go (Required: v1.23+)
go version

# Check Python (Required: v3.8+)
python --version
```

If not installed:
- **Node.js**: Download from https://nodejs.org/
- **Go**: Download from https://go.dev/dl/
- **Python**: Download from https://www.python.org/

---

### 2️⃣ Get Your API Keys

#### A. Clerk (Authentication)
1. Go to https://clerk.com/
2. Sign up for free account
3. Create new application
4. Get your keys from "API Keys" section:
   - `CLERK_SECRET_KEY` (starts with `sk_test_`)
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
5. Add `http://localhost:3000` to allowed origins

#### B. Stripe (Payments)
1. Go to https://stripe.com/
2. Sign up for free account
3. Stay in **Test Mode** (toggle in top right)
4. Get keys from Developers > API keys:
   - `STRIPE_SECRET_KEY` (starts with `sk_test_`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (starts with `pk_test_`)
5. Create products and prices in Products section
6. Copy price IDs (start with `price_`)

#### C. Google Gemini (AI)
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy your `GEMINI_API_KEY`

#### D. Firebase (Database)
1. Go to https://console.firebase.google.com/
2. Create new project (select free Spark plan)
3. Enable Realtime Database AND Firestore
4. Go to Project Settings > Service Accounts
5. Click "Generate New Private Key"
6. Save the downloaded JSON file as `api_key.json`
7. Copy your database URL (format: `https://your-project.firebaseio.com`)

#### E. Finnhub (Stock Data)
1. Go to https://finnhub.io/
2. Sign up for free account
3. Get your API key from dashboard
4. Copy your `FINNHUB_API_KEY`

---

### 3️⃣ Configure Backend

1. **Create .env file**:
```powershell
cd backend
Copy-Item .env.example .env
```

2. **Edit backend\.env** and fill in your API keys

3. **Add Firebase credentials**:
   - Place the `api_key.json` file in the `backend/` folder

---

### 4️⃣ Configure Frontend

1. **Create .env.local file**:
```powershell
cd ..\frontend
Copy-Item .env.local.example .env.local
```

2. **Edit frontend\.env.local** and fill in your API keys

---

### 5️⃣ Install Dependencies

#### Backend (Go):
```powershell
cd backend
go mod tidy
```

#### Frontend (Next.js):
```powershell
cd ..\frontend
npm install
```

#### ML Service (Python):
```powershell
cd ..\recommendations_model
pip install -r requirements.txt
```

---

### 6️⃣ Run the Project

Open **3 separate terminals**:

**Terminal 1 - Backend (Go)**:
```powershell
cd backend
go run main.go
```
✅ Should run on: http://localhost:8080

**Terminal 2 - Frontend (Next.js)**:
```powershell
cd frontend
npm run dev
```
✅ Should run on: http://localhost:3000

**Terminal 3 - ML Service (Python)**:
```powershell
cd recommendations_model
uvicorn app:app --reload
```
✅ Should run on: http://localhost:8000

---

## 🌐 Hosting Options (FREE)

### Recommended FREE Hosting:

1. **Frontend (Next.js)**:
   - ✅ **Vercel** (BEST for Next.js) - https://vercel.com/
     - Free tier: Unlimited personal projects
     - Automatic deployments from GitHub
     - Built-in CI/CD

2. **Backend (Go)**:
   - ✅ **Railway** - https://railway.app/
     - Free tier: $5 credit/month
   - ✅ **Render** - https://render.com/
     - Free tier with limitations

3. **ML Service (Python)**:
   - ✅ **Railway** or **Render**
   - Both support Python apps

### Alternative Options:
- **Netlify** (Frontend) - https://netlify.com/
- **Fly.io** (Backend) - https://fly.io/
- **Google Cloud Run** (All services) - Free tier available

---

## ⚠️ Common Issues

### Issue: "CLERK_SECRET_KEY is required"
**Solution**: Make sure you created `.env` file in backend folder and added your Clerk secret key

### Issue: "Error initializing Firebase"
**Solution**: 
1. Check that `api_key.json` exists in backend folder
2. Verify `FIREBASE_DB_URL` is set in `.env`

### Issue: "Stripe API key validation failed"
**Solution**: Make sure you're using the **test mode** key (starts with `sk_test_`)

### Issue: "Port already in use"
**Solution**: 
```powershell
# Kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

## 📊 Cost Breakdown

| Service | Free Tier | Paid Tier Starts |
|---------|-----------|------------------|
| Clerk | 10,000 MAUs | $25/month |
| Stripe | Test mode free | Pay only when live |
| Gemini | 60 req/min | Flexible pricing |
| Firebase | 1GB storage | $25/month (Blaze) |
| Finnhub | 60 calls/min | $0/month (Free) |
| Vercel | Unlimited projects | $20/month (Pro) |

**Total for development: $0/month** ✅

---

## 📞 Support

If you encounter any issues:
1. Check the error messages in each terminal
2. Verify all API keys are correct
3. Make sure all 3 services are running
4. Check Firebase console for database issues

Happy coding! 🚀
