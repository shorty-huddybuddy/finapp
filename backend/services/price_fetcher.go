package services

import (
	"context"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/valyala/fastjson"

	finnhub "github.com/Finnhub-Stock-API/finnhub-go/v2"
)

type PriceFetcher interface {
	GetCurrentPrice(ticker string, assetType string) (float64, error)
}

type RealTimePriceFetcher struct {
	client *finnhub.DefaultApiService
}

type nprice struct {
}

func extractMarketPrice(body []byte) (float64, error) {
	var p fastjson.Parser
	v, err := p.ParseBytes(body)
	if err != nil {
		return 0, err
	}

	// Navigate JSON structure using fastjson
	price := v.GetFloat64("chart", "result", "0", "meta", "regularMarketPrice")
	if price == 0 {
		price = -1
	}
	return price, nil
}

func NewRealTimePriceFetcher(apiKey string) *RealTimePriceFetcher {
	cfg := finnhub.NewConfiguration()
	cfg.AddDefaultHeader("X-Finnhub-Token", apiKey)
	//fmt.Println("API KEY", apiKey)
	finnhubClient := finnhub.NewAPIClient(cfg).DefaultApi

	return &RealTimePriceFetcher{
		client: finnhubClient,
	}
}

func (f *RealTimePriceFetcher) GetCurrentPrice(ticker string, assetType string) (float64, error) {
	switch assetType {
	case "stock":
		price, err := f.fetchStockPrice(ticker)
		if err != nil || price == 0 {
			url := fmt.Sprintf("https://query1.finance.yahoo.com/v7/finance/chart/%s.NS", ticker)

			nprice, err := http.Get(url)
			if err != nil {
				return -1, nil
			}
			defer nprice.Body.Close()

			body, err := ioutil.ReadAll(nprice.Body)
			if err != nil {
				return 0, err
			}

			usd_price,err := extractMarketPrice(body)
			usd_price = usd_price/86
			
			return usd_price,err
		}
		
		return price, nil
	case "crypto":
		price, err := f.fetchCryptoPrice(ticker)
		if err != nil {
			return -1, nil
		}
		return price, nil

	default:
		return 0, fmt.Errorf("unsupported asset type: %s", assetType)
	}
}

func (f *RealTimePriceFetcher) fetchStockPrice(ticker string) (float64, error) {
	quote, _, err := f.client.Quote(context.Background()).Symbol(ticker).Execute()
	if err != nil {
		return 0, fmt.Errorf("failed to fetch stock price: %w", err)
	}

	if quote.C == nil {
		return 0, fmt.Errorf("no current price available for %s", ticker)
	}

	return float64(*quote.C), nil
}

func (f *RealTimePriceFetcher) fetchCryptoPrice(ticker string) (float64, error) {
	cryptoSymbol := fmt.Sprintf("BINANCE:%sUSDT", ticker)
	quote, _, err := f.client.Quote(context.Background()).Symbol(cryptoSymbol).Execute()
	if err != nil {
		return 0, fmt.Errorf("failed to fetch crypto price: %w", err)
	}

	if quote.C == nil {
		return 0, fmt.Errorf("no current price available for %s", ticker)
	}

	return float64(*quote.C), nil
}
