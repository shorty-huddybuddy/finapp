package handlers

import (
	"backend/database"
	"backend/services"
	"context"
	"fmt"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
)

type WatchlistItem struct {
	UserID    string  `json:"user_id"`
	Ticker    string  `json:"ticker"`
	Type      string  `json:"type"` // "stock" or "crypto"
	BuyPrice  float64 `json:"buy_price"`
	Quantity  float64 `json:"quantity"`
	Timestamp string  `json:"timestamp"`
}

type WatchlistResponse struct {
	Watchlist            []WatchlistItemWithMetrics `json:"watchlist"`
	TotalPortfolioValue  float64                    `json:"total_portfolio_value"`
	TotalPNL             float64                    `json:"total_pnl"`
	HoldingsDistribution map[string]float64         `json:"holdings_distribution"`
	InvestmentByType     map[string]float64         `json:"investment_by_type"`    // New field
	ProfitByAsset        map[string]AssetProfit     `json:"profit_by_asset"`       // New field
}

type WatchlistItemWithMetrics struct {
	WatchlistItem
	ID 		 string  `json:"id"`
	CurrentPrice float64 `json:"current_price"`
	PNL          float64 `json:"pnl"`
}

type AssetProfit struct {
	Amount          float64 `json:"amount"`
	PercentageGain  float64 `json:"percentage_gain"`
	InvestedAmount  float64 `json:"invested_amount"`
	CurrentValue    float64 `json:"current_value"`
}

func WatchlistHandler(c *fiber.Ctx) error {
	switch c.Method() {
	case "POST":
		return addToWatchlist(c)
	case "DELETE":
		return removeFromWatchlist(c)
	case "GET":
		return getWatchlist(c)
	case "PUT":
		return updateWatchlistItem(c)
	default:
		return c.Status(fiber.StatusMethodNotAllowed).JSON(fiber.Map{
			"error": "Method not allowed",
		})
	}
}

func addToWatchlist(c *fiber.Ctx) error {
    var item WatchlistItem
    if err := c.BodyParser(&item); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Invalid request body",
        })
    }

    // Add timestamp
    item.Timestamp = time.Now().Format(time.RFC3339)

    // Get reference to user's watchlist
    ref := database.GetFirebaseDB().NewRef(fmt.Sprintf("watchlists/%s", item.UserID))
    
    // Check if item with same ticker already exists
    var items map[string]WatchlistItem
    if err := ref.Get(context.Background(), &items); err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to fetch watchlist data",
        })
    }
    
    // Look for existing item with same ticker and type
    for existingID, existingItem := range items {
        if existingItem.Ticker == item.Ticker && existingItem.Type == item.Type {
            // Item exists, calculate new quantity
            totalQuantity := existingItem.Quantity + item.Quantity
            
            // Calculate weighted average buy price
            avgPrice := ((existingItem.BuyPrice * existingItem.Quantity) + 
                        (item.BuyPrice * item.Quantity)) / totalQuantity
            
            // Update the existing item
            updateData := map[string]interface{}{
                "quantity": totalQuantity,
                "buy_price": avgPrice,
                "timestamp": item.Timestamp,
            }
            
            itemRef := ref.Child(existingID)
            if err := itemRef.Update(context.Background(), updateData); err != nil {
                return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
                    "error": "Failed to update existing item: " + err.Error(),
                })
            }
            
            return c.JSON(fiber.Map{
                "message": "Item updated successfully",
                "item_id": existingID,
                "user_id": item.UserID,
                "updated_quantity": totalQuantity,
                "updated_price": avgPrice,
            })
        }
    }
    
    // No existing item found, create new one
    newRef, err := ref.Push(context.Background(), item)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to store user data: " + err.Error(),
        })
    }

    return c.JSON(fiber.Map{
        "message": "Item added successfully",
        "item_id": newRef.Key,
        "user_id": item.UserID,
    })
}

func removeFromWatchlist(c *fiber.Ctx) error {
	userID := c.Query("user_id")
	itemID := c.Query("item_id")

	if userID == "" || itemID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing user_id or item_id",
		})
	}

	ref := database.GetFirebaseDB().NewRef(fmt.Sprintf("watchlists/%s/%s", userID, itemID))
	if err := ref.Delete(context.Background()); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to remove item from watchlist",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Item removed successfully",
	})
}

func getWatchlist(c *fiber.Ctx) error {
	userID := c.Query("user_id")
	fmt.Println(userID);
	if userID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing user_id",
		})
	}
	

	var priceFetcher = services.NewRealTimePriceFetcher(os.Getenv("FINHUB_API_KEY"))

	ref := database.GetFirebaseDB().NewRef(fmt.Sprintf("watchlists/%s", userID))
	var items map[string]WatchlistItem
	if err := ref.Get(c.Context(), &items); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch watchlist",
		})
	}

	var watchlistWithMetrics []WatchlistItemWithMetrics
	var totalValue float64
	var totalPNL float64
	holdingsDistribution := make(map[string]float64)
	investmentByType := make(map[string]float64)      // Track investment by asset type
	profitByAsset := make(map[string]AssetProfit)     // Track profit metrics per asset

	// First pass: Calculate total value and metrics
	for itemiD, item := range items {
		currentPrice, err := priceFetcher.GetCurrentPrice(item.Ticker, item.Type)
		if err != nil {
			fmt.Printf("Error fetching price for %s: %v\n", item.Ticker, err)
			continue
		}

		initialInvestment := item.BuyPrice * item.Quantity
		currentValue := currentPrice * item.Quantity
		profitAmount := currentValue - initialInvestment
		profitPercentage := (profitAmount / initialInvestment) * 100

		// Update investment by type
		investmentByType[item.Type] += initialInvestment

		// Update profit metrics for this asset
		profitByAsset[item.Ticker] = AssetProfit{
			Amount:          profitAmount,
			PercentageGain: profitPercentage,
			InvestedAmount: initialInvestment,
			CurrentValue:   currentValue,
		}

		itemValue := currentPrice * item.Quantity
		itemPNL := (currentPrice - item.BuyPrice) * item.Quantity

		metrics := WatchlistItemWithMetrics{
			WatchlistItem: item,
			ID: 		  itemiD,
			CurrentPrice:  currentPrice,
			PNL:           itemPNL,
		}

		watchlistWithMetrics = append(watchlistWithMetrics, metrics)
		totalValue += itemValue
		totalPNL += itemPNL
		// Track distribution by ticker instead of type
		holdingsDistribution[item.Ticker] = itemValue
	}

	// Calculate percentage distribution for each asset
	if totalValue > 0 {
		for ticker, value := range holdingsDistribution {
			holdingsDistribution[ticker] = (value / totalValue) * 100
		}
	}

	response := WatchlistResponse{
		Watchlist:            watchlistWithMetrics,
		TotalPortfolioValue:  totalValue,
		TotalPNL:             totalPNL,
		HoldingsDistribution: holdingsDistribution,
		InvestmentByType:     investmentByType,
		ProfitByAsset:        profitByAsset,
	}
	fmt.Println("Response", response)
	return c.JSON(response)
}

// func getWatchlist(c *fiber.Ctx) error {
// 	userID := c.Query("user_id")
// 	if userID == "" {
// 		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
// 			"error": "Missing user_id",
// 		})
// 	}
// 	var priceFetcher = services.NewRealTimePriceFetcher(os.Getenv("FINHUB_API_KEY"))

// 	ref := database.GetFirebaseDB().NewRef(fmt.Sprintf("watchlists/%s", userID))
// 	var items map[string]WatchlistItem
// 	if err := ref.Get(c.Context(), &items); err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
// 			"error": "Failed to fetch watchlist",
// 		})
// 	}

// 	fmt.Println("Items", items)
// 	// currentPrice, err := priceFetcher.GetCurrentPrice("AAPL", "stock")
// 	// fmt.Println(err, currentPrice)

// 	// Calculate metrics
// 	var watchlistWithMetrics []WatchlistItemWithMetrics
// 	var totalValue float64
// 	var totalPNL float64
// 	holdingsDistribution := make(map[string]float64)

// 	for _, item := range items {
// 		currentPrice, err := priceFetcher.GetCurrentPrice(item.Ticker, item.Type)
// 		if err != nil {
// 			fmt.Printf("Error fetching price for %s: %v\n", item.Ticker, err)
// 			// continue
// 		}

// 		itemValue := currentPrice * item.Quantity
// 		itemPNL := (currentPrice - item.BuyPrice) * item.Quantity

// 		metrics := WatchlistItemWithMetrics{
// 			WatchlistItem: item,
// 			CurrentPrice:  currentPrice,
// 			PNL:           itemPNL,
// 		}

// 		watchlistWithMetrics = append(watchlistWithMetrics, metrics)
// 		totalValue += itemValue
// 		totalPNL += itemPNL
// 		holdingsDistribution[item.Type] += itemValue
// 	}

// 	// Calculate percentage distribution
// 	for assetType, value := range holdingsDistribution {
// 		holdingsDistribution[assetType] = (value / totalValue) * 100
// 	}

// 	response := WatchlistResponse{
// 		Watchlist:            watchlistWithMetrics,
// 		TotalPortfolioValue:  totalValue,
// 		TotalPNL:             totalPNL,
// 		HoldingsDistribution: holdingsDistribution,
// 	}
// 	// response =
// 	return c.JSON(response)
// }

func updateWatchlistItem(c *fiber.Ctx) error {
	var item WatchlistItem
	if err := c.BodyParser(&item); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}
	updateData := map[string]interface{}{
		"user_id":   item.UserID,
		"ticker":    item.Ticker,
		"type":      item.Type,
		"buy_price": item.BuyPrice,
		"quantity":  item.Quantity,
		"timestamp": item.Timestamp,
	}

	itemID := c.Query("item_id")
	if itemID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing item_id",
		})
	}

	ref := database.GetFirebaseDB().NewRef(fmt.Sprintf("watchlists/%s/%s", item.UserID, itemID))
	// if err := ref.Update(context.Background(),item); err != nil {
	//     return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
	//         "error": "Failed to update item",
	//     })
	// }

	if err := ref.Update(context.Background(), updateData); err != nil {
		// Handle error
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update item",
		})

	}
	return c.JSON(fiber.Map{
		"message": "Item updated successfully",
		"item":    item,
	})
}
