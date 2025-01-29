package services

import (
	"context"
	"fmt"

	finnhub "github.com/Finnhub-Stock-API/finnhub-go/v2"
)

type PriceFetcher interface {
	GetCurrentPrice(ticker string, assetType string) (float64, error)
}

type RealTimePriceFetcher struct {
	client *finnhub.DefaultApiService
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
		return f.fetchStockPrice(ticker)
	case "crypto":
		return f.fetchCryptoPrice(ticker)
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

// func main() {
// 	priceFetcher := NewRealTimePriceFetcher("cuad5apr01qkpes4pk2gcuad5apr01qkpes4pk30")
// 	price, err := priceFetcher.GetCurrentPrice("SOL", "crypto")
// 	fmt.Println(price, err)

// }
