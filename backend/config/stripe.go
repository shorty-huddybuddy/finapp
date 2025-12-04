package config

import (
	"fmt"
	"log"
	"os"

	"github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/price"
)

// Remove the global variable initialization
var StripePriceConfig map[string]string

// InitStripe initializes Stripe with proper authentication
func InitStripe() error {
	// Initialize the price config inside InitStripe where we're sure env vars are loaded
	StripePriceConfig = map[string]string{
		"premium-monthly": os.Getenv("PLATFORM_PREMIUM_MONTHLY_PRICE_ID"),
		"premium-yearly":  os.Getenv("PLATFORM_PREMIUM_YEARLY_PRICE_ID"),
		"creator-basic":   os.Getenv("CREATOR_BASIC_PRICE_ID"),
		"creator-pro":     os.Getenv("CREATOR_PRO_PRICE_ID"),
		"creator-vip":     os.Getenv("CREATOR_VIP_PRICE_ID"),
	}

	// Validate that required price IDs are present (skip in dev mode)
	if os.Getenv("APP_ENV") != "development" {
		requiredPrices := []string{"premium-monthly", "premium-yearly"}
		for _, tier := range requiredPrices {
			if StripePriceConfig[tier] == "" {
				return fmt.Errorf("missing required price ID for tier: %s", tier)
			}
			log.Printf("Loaded price ID for %s: %s", tier, StripePriceConfig[tier])
		}
	}

	// Debug: Print all price IDs at startup
	for tier, priceID := range StripePriceConfig {
		if priceID == "" {
			log.Printf("WARNING: Missing price ID for tier %s", tier)
		} else {
			log.Printf("Loaded price ID for %s: %s", tier, priceID)
		}
	}

	key := os.Getenv("STRIPE_SECRET_KEY")
	if key == "" {
		return fmt.Errorf("STRIPE_SECRET_KEY is not set")
	}

	// Set the Stripe API key
	stripe.Key = key

	// Enable idempotency for better error handling
	stripe.EnableTelemetry = false

	// Configure logging for development
	if os.Getenv("APP_ENV") != "production" {
		stripe.DefaultLeveledLogger = &stripe.LeveledLogger{
			Level: stripe.LevelDebug,
		}
	}

	return nil
}

// ValidateAPIKey checks if the Stripe API key is valid
func ValidateAPIKey() error {
	// Skip validation in development mode to allow server startup without Stripe products
	if os.Getenv("APP_ENV") == "development" {
		log.Println("⚠️  Skipping Stripe API validation in development mode")
		return nil
	}

	// Make a simple API call to verify the key
	params := &stripe.PriceListParams{}
	i := price.List(params)
	if i.Err() != nil {
		return fmt.Errorf("invalid Stripe API key: %v", i.Err())
	}
	return nil
}

func getPriceIDForTier(tierID string) string {
	priceID, exists := StripePriceConfig[tierID]
	if !exists || priceID == "" {
		log.Printf("Error: No price ID found for tier '%s'. Available tiers: premium-monthly, premium-yearly, creator-basic, creator-pro, creator-vip", tierID)
		return ""
	}
	log.Printf("Using price ID %s for tier %s", priceID, tierID)
	return priceID
}
