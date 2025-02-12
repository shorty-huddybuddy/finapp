package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	finnhub "github.com/Finnhub-Stock-API/finnhub-go/v2"
	"github.com/gofiber/fiber/v2"
)

// Define struct for filtered response
type SearchResult struct {
	Symbol      string `json:"symbol"`
	Description string `json:"description"`
}

// CoinGecko response structure
type CoinGeckoItem struct {
	ID     string `json:"id"`
	Symbol string `json:"symbol"`
	Name   string `json:"name"`
}

func SearchHandler(c *fiber.Ctx) error {
	cfg := finnhub.NewConfiguration()
	cfg.AddDefaultHeader("X-Finnhub-Token", os.Getenv("FINHUB_API_KEY"))
	finnhubClient := finnhub.NewAPIClient(cfg).DefaultApi

	symbol := c.Query("symbol")
	category := c.Query("type")

	if category == "stock" {
		res, _, err := finnhubClient.SymbolSearch(context.Background()).Q(symbol).Execute()
		if err != nil {
			fmt.Println(err)
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to fetch stock data",
			})
		}

		// Create filtered results for stocks
		filteredResults := make([]SearchResult, 0)
		for _, item := range res.GetResult() {
			filteredResults = append(filteredResults, SearchResult{
				Symbol:      item.GetSymbol(),
				Description: item.GetDescription(),
			})
		}
		return c.JSON(filteredResults)

	} else if category == "crypto" {
		url := "https://api.coingecko.com/api/v3/coins/list"
		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to create request",
			})
		}

		req.Header.Add("accept", "application/json")
		req.Header.Add("x-cg-demo-api-key", "CG-M62JTTsUN6HLgLH69pkGaoVd")

		res, err := http.DefaultClient.Do(req)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to fetch crypto data",
			})
		}
		defer res.Body.Close()

		body, err := io.ReadAll(res.Body)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to read response",
			})
		}

		var coins []CoinGeckoItem
		if err := json.Unmarshal(body, &coins); err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Failed to parse response",
			})
		}

		// Filter and limit results
		filteredResults := make([]SearchResult, 0)
		count := 0
		maxResults := 10 // Limit to top 10 results

		// Case-insensitive search
		searchTerm := strings.ToLower(symbol)

		for _, coin := range coins {
			// Match against symbol or name
			if strings.HasPrefix(strings.ToLower(coin.Symbol), searchTerm) {
				filteredResults = append(filteredResults, SearchResult{
					Symbol:      strings.ToUpper(coin.Symbol),
					Description: coin.Name,
				})
				count++
				if count >= maxResults {
					break
				}
			}
		}

		return c.JSON(filteredResults)

	} else {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid category type",
		})
	}
}
