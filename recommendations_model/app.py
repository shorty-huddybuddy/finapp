from fastapi import FastAPI, HTTPException, Request, Query
from fastapi.responses import JSONResponse
import datetime as dt
import yfinance as yf
import numpy as np
from sklearn import preprocessing
from sklearn.linear_model import LinearRegression
from fastapi.middleware.cors import CORSMiddleware
import time, json, gc, random, os
from apscheduler.schedulers.background import BackgroundScheduler
from firebase_admin import credentials, firestore, initialize_app, db
from pydantic import BaseModel
from typing import Optional, List, Dict
from tensorflow.keras import backend as K
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import LSTM, Dense, GRU, Dropout, Conv1D, Flatten, Concatenate, Input, Attention
from tensorflow.keras.optimizers import Adam
import tensorflow as tf
from gnews import GNews
import os
from dotenv import load_dotenv

# Set random seeds for reproducibility
seed = 40
np.random.seed(seed)
tf.random.set_seed(seed)
random.seed(seed)

# Disable GPU non-determinism
os.environ['TF_DETERMINISTIC_OPS'] = '1'
os.environ['TF_CUDNN_DETERMINISTIC'] = '1'

app = FastAPI()

def reset_tf_session():
    K.clear_session()

cred_obj = credentials.Certificate('api_key.json')

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment variables
database_url = os.getenv('DB_URL')
if not database_url:
    raise ValueError("Database URL not found in environment variables. Ensure DB_URL is set in your .env file.")
print(database_url)
default_app = initialize_app(cred_obj, {
    'databaseURL': database_url
})


class PredictionItem(BaseModel):
    Date: str
    Prediction: float

class StockPredictionModel(BaseModel):
    linear_regression: List[PredictionItem]
    lstm: List[PredictionItem]
    gru: List[PredictionItem]

class StockPredictions(BaseModel):
    recommendations: Dict[str, StockPredictionModel]  # Maps ticker symbols to predictions


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


scheduler = BackgroundScheduler()
is_locked = False


def save_prediction(ticker: str, predictions: dict):
    """Save prediction data with timestamp to the database"""
    try:
        # Add a timestamp to the predictions
        predictions["timestamp"] = str(dt.datetime.now())
        
        # Use Firebase Realtime Database
        ref = db.reference("/predictions")
        ref.child(ticker).set(predictions)
        
        print(f"Saved prediction for {ticker} with timestamp {predictions['timestamp']}")
    except Exception as e:
        print(f"Error saving prediction: {str(e)}")


def ensemble_model(X, y, X_forecast):
    # Define Input Layer
    input_layer = Input(shape=(X.shape[1], 1))

    # CNN Branch
    cnn_branch = Conv1D(filters=64, kernel_size=3, activation='relu', padding='same')(input_layer)
    cnn_branch = Flatten()(cnn_branch)

    # LSTM Branch
    lstm_branch = LSTM(64, return_sequences=True)(input_layer)  # Keep sequence dimension
    lstm_branch = LSTM(32, return_sequences=True)(lstm_branch)  # Keep sequence dimension

    # GRU Branch
    gru_branch = GRU(64, return_sequences=True)(input_layer)  # Keep sequence dimension
    gru_branch = GRU(32, return_sequences=True)(gru_branch)  # Keep sequence dimension

    # Attention Layer
    attention_output = Attention()([lstm_branch, gru_branch])  # Both inputs are 3D now
    attention_output = Flatten()(attention_output)  # Flatten to match other branches

    # Concatenate Layers
    merged = Concatenate()([cnn_branch, Flatten()(lstm_branch), Flatten()(gru_branch), attention_output])
    merged = Dense(64, activation='relu')(merged)
    merged = Dense(32, activation='relu')(merged)
    output_layer = Dense(1, activation='relu')(merged)

    # Define Model
    model = Model(inputs=input_layer, outputs=output_layer)
    model.compile(optimizer=Adam(learning_rate=0.0001), loss='mse', metrics=['mae'])

    # Train Model
    model.fit(X, y, epochs=100, batch_size=32, verbose=1)
    forecast_ensemble = model.predict(X_forecast).flatten()

    return forecast_ensemble

@app.middleware("http")
async def block_routes_during_task(request: Request, call_next):
    """Middleware to block all routes while the task runs."""
    if is_locked:
        return JSONResponse(content={"error": "Server is temporarily locked under maintainance , try again later after 30 minutes "}, status_code=503)
    return await call_next(request)

def check_cached_prediction(ticker: str, number_of_days: int = 10):
    """Check if we have a recent prediction cached in the database for this ticker."""
    try:
        # Use Firebase Realtime Database
        ref = db.reference(f"/predictions/{ticker}")
        cached_data = ref.get()
        
        if not cached_data:
            print(f"No cached data found for {ticker}")
            return None
        
        # Check if cache has a timestamp and if it's less than 1 day old
        if "timestamp" in cached_data:
            try:
                cache_time = dt.datetime.fromisoformat(cached_data["timestamp"].replace(" ", "T"))
                current_time = dt.datetime.now()
                time_diff = current_time - cache_time
                
                # If cache is less than 1 day old, use the cached data
                if time_diff.days < 1:
                    print(f"Using cached data for {ticker} (age: {time_diff})")
                    return cached_data
                else:
                    print(f"Cached data for {ticker} is too old (age: {time_diff})")
            except ValueError as e:
                print(f"Error parsing timestamp: {str(e)}")
        
        return None
    except Exception as e:
        print(f"Error checking cached prediction: {str(e)}")
        return None

@app.get("/predict")
def get_stock_predictions(ticker: str = "AAPL", period: str = "1y", interval: str = "1h", number_of_days: int = 10):
    # Check if we have a recent prediction cached
    ticker = ticker.upper()
    cached_prediction = check_cached_prediction(ticker, number_of_days)
    
    if cached_prediction:
        # Remove the timestamp before returning to client
        if "timestamp" in cached_prediction:
            # Create a copy to avoid modifying the original
            response_data = cached_prediction.copy()
            # Keep timestamp info in the logs but don't send to client
            print(f"Using cache from: {response_data['timestamp']}")
            del response_data["timestamp"]
            return JSONResponse(content=response_data)
    
    # If no valid cache exists, generate a new prediction
    reset_tf_session()  
    start_time = time.time()  

    # df_ml = yf.download(tickers=ticker, period=period, interval=interval)

    # if df_ml.empty:
    for suffix in ["-USD", "" , ".NS", ".BO"]:
        df_ml = yf.download(tickers=ticker + suffix, period=period, interval=interval)
        if not df_ml.empty:
            break

    if df_ml.empty:
        return JSONResponse(content={"error": "No stock data available for the given ticker and period"}, status_code=400)

    df_ml = df_ml[['Close']]
    
    if number_of_days >= len(df_ml):
        return JSONResponse(content={"error": "Insufficient data for the given number_of_days"}, status_code=400)

    forecast_out = int(number_of_days)
    df_ml['Prediction'] = df_ml[['Close']].shift(-forecast_out)
    df_ml.dropna(inplace=True)

    X = np.array(df_ml.drop(['Prediction'], axis=1))
    if X.shape[0] == 0:
        return JSONResponse(content={"error": "Not enough data after preprocessing"}, status_code=400)

    X = preprocessing.scale(X)
    X_forecast = X[-forecast_out:]
    X = X[:-forecast_out]
    y = np.array(df_ml['Prediction'])[:-forecast_out]

    if len(X) == 0 or len(y) == 0:
        return JSONResponse(content={"error": "Dataset is empty after preprocessing"}, status_code=400)

    forecast_ensemble = ensemble_model(X,y,X_forecast)
    print(forecast_ensemble)

    dates = [dt.datetime.today() + dt.timedelta(days=i) for i in range(forecast_out)]
    result = {
        "ensemble_model": [{"Date": str(d), "Prediction": str(p) } for d, p in zip(dates, forecast_ensemble)]
    }

    end_time = time.time()
    print(f"Prediction for {ticker} took {end_time - start_time} seconds")
    
    # Save the prediction to the database with a timestamp
    save_prediction(ticker, result)
    
    gc.collect()  # Force garbage collection
    return JSONResponse(content=result)


@app.get("/recommendations")
def get_recommendations():
    try:
        # Use Firebase Realtime Database
        ref = db.reference("/predictions")
        
        # Retrieve all data under 'predictions'
        recommendations = ref.get()
        
        # If no data is found
        if not recommendations:
            raise HTTPException(status_code=404, detail="No recommendations found")
        
        # Remove timestamps before returning the data
        for ticker in recommendations:
            if "timestamp" in recommendations[ticker]:
                del recommendations[ticker]["timestamp"]
        
        # Return the recommendations as JSON
        return JSONResponse(content=recommendations)
    
    except Exception as e:
        # Return error if something goes wrong
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/news")
def get_news(topic: str =  Query ("Latest News", alias="topic")):
    google_news = GNews()
    google_news.period = '5d'  # News from last 7 days
    google_news.max_results = 3  # number of responses across a keyword
    google_news.language = 'english'  # News in a specific language
    news = google_news.get_news(topic)
    # print(news)
    return JSONResponse(content=news)
