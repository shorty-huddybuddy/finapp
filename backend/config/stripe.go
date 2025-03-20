package config

import (
	"fmt"
	"os"

	"github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/price"
)

// StripePriceConfig holds all price IDs with proper environment variables
var StripePriceConfig = map[string]string{
	// Creator tiers
	"creator-basic": os.Getenv("CREATOR_BASIC_PRICE_ID"),
	"creator-pro":   os.Getenv("CREATOR_PRO_PRICE_ID"),
	"creator-vip":   os.Getenv("CREATOR_VIP_PRICE_ID"),
	// Platform tiers
	"premium-monthly": os.Getenv("PLATFORM_PREMIUM_MONTHLY_PRICE_ID"),
	"premium-yearly":  os.Getenv("PLATFORM_PREMIUM_YEARLY_PRICE_ID"),
	// Simplified tier mapping
	"basic": os.Getenv("CREATOR_BASIC_PRICE_ID"),
	"pro":   os.Getenv("CREATOR_PRO_PRICE_ID"),
	"vip":   os.Getenv("CREATOR_VIP_PRICE_ID"),
}

// InitStripe initializes Stripe with proper authentication
func InitStripe() error {
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
	// Make a simple API call to verify the key
	params := &stripe.PriceListParams{}
	i := price.List(params)
	if i.Err() != nil {
		return fmt.Errorf("invalid Stripe API key: %v", i.Err())
	}
	return nil
}
