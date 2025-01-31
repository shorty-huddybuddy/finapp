from fastapi import FastAPI
from fastapi.responses import JSONResponse
import pandas as pd
import datetime as dt
import yfinance as yf
import numpy as np
from sklearn import preprocessing
from sklearn.linear_model import LinearRegression
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, GRU, Dropout
from tensorflow.keras.optimizers import Adam
from fastapi.middleware.cors import CORSMiddleware
import json
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/predict")
def get_stock_predictions(ticker: str = "AAPL",period: str = "1y",interval: str = "1h",number_of_days: int = 10):
    start_time = time.time()  
    ticker = ticker.upper()
    df_ml = yf.download(tickers=ticker, period=period, interval=interval)
    print(df_ml)

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

    # Linear Regression Model
    clf = LinearRegression()
    clf.fit(X, y)
    forecast_lr = clf.predict(X_forecast).tolist()

    # LSTM Model
    model_lstm = Sequential([
        LSTM(64, input_shape=(len(X), len(X[0]))),
        Dense(124, activation='relu'),
        Dense(64, activation='relu'),
        Dense(16, activation='relu'),
        Dense(1, activation='relu')
    ])
    model_lstm.compile(optimizer='adam', loss='mse')
    model_lstm.fit(X, y, epochs=100, batch_size=32, verbose=0)
    forecast_lstm = model_lstm.predict(X_forecast).tolist()

    # GRU Model
    model_gru = Sequential([
        GRU(64, return_sequences=True, input_shape=(X.shape[1], 1)),
        Dropout(0.2),
        GRU(64, return_sequences=False),
        Dropout(0.2),
        Dense(32, activation='relu'),
        Dense(1)
    ])
    model_gru.compile(optimizer=Adam(learning_rate=0.001), loss='mse', metrics=['mae'])
    model_gru.fit(X, y, epochs=100, batch_size=32, verbose=0)
    forecast_gru = model_gru.predict(X_forecast).tolist()   

    dates = [dt.datetime.today() + dt.timedelta(days=i) for i in range(forecast_out)]
    result = {
        "linear_regression": [{"Date": str(d), "Prediction": p} for d, p in zip(dates, forecast_lr)],
        "lstm": [{"Date": str(d), "Prediction": p} for d, p in zip(dates, forecast_lstm)],
        "gru": [{"Date": str(d), "Prediction": p} for d, p in zip(dates, forecast_gru)],
    }

    end_time = time.time()
    print(end_time - start_time)
    return JSONResponse(content=result)
