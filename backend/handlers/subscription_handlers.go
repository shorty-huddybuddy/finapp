package handlers

import (
	"backend/config"
	"backend/database"
	"backend/models"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/gofiber/fiber/v2"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/checkout/session"
	"github.com/stripe/stripe-go/v72/price"
)

// CheckSubscriptionAccessRequest holds the data for subscription access check
type CheckSubscriptionAccessRequest struct {
	CreatorID string `json:"creatorId"`
	TierID    string `json:"tier"`
}

// CheckSubscriptionAccess checks if a user has access to premium content
func CheckSubscriptionAccess(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	log.Printf("[CheckSubscriptionAccess] Starting check for userID: %s", userID)

	// Initialize with empty values if not provided
	req := CheckSubscriptionAccessRequest{
		CreatorID: c.Query("creatorId", ""), // Get from query params
		TierID:    c.Query("tier", ""),      // Get from query params
	}

	// Only try to parse body if content-type is application/json
	if c.Get("Content-Type") == "application/json" {
		if err := c.BodyParser(&req); err != nil {
			log.Printf("[CheckSubscriptionAccess] Invalid request body: %v", err)
			// Continue with query params instead of returning error
		}
	}

	log.Printf("[CheckSubscriptionAccess] Checking access for creatorID: %s, tierID: %s", req.CreatorID, req.TierID)

	// Check if user has platform-wide subscription
	platformSub, err := getUserPlatformSubscription(userID)
	if err != nil {
		log.Printf("[CheckSubscriptionAccess] Error fetching platform subscription: %v", err)
		// Continue to check creator subscriptions even if platform check fails
	} else if platformSub != nil && platformSub.Status == "active" {
		// Platform subscribers have access to all content
		log.Printf("[CheckSubscriptionAccess] User has active platform subscription")
		return c.JSON(fiber.Map{
			"hasAccess": true,
			"type":      "platform",
		})
	}

	// If checking for creator-specific content
	if req.CreatorID != "" {
		// Check if user has subscription to this creator
		creatorSub, err := getUserCreatorSubscription(userID, req.CreatorID)
		if err != nil {
			log.Printf("[CheckSubscriptionAccess] Error fetching creator subscription: %v", err)
		} else if creatorSub != nil && creatorSub.Status == "active" {
			// Check if the subscription tier is sufficient
			if isTierSufficient(creatorSub.TierID, req.TierID) {
				log.Printf("[CheckSubscriptionAccess] User has sufficient creator subscription tier: %s", creatorSub.TierID)
				return c.JSON(fiber.Map{
					"hasAccess": true,
					"type":      "creator",
					"tier":      creatorSub.TierID,
				})
			} else {
				log.Printf("[CheckSubscriptionAccess] User has creator subscription but insufficient tier: %s (required: %s)", creatorSub.TierID, req.TierID)
			}
		}
	}

	log.Printf("[CheckSubscriptionAccess] User does not have access")
	return c.JSON(fiber.Map{
		"hasAccess": false,
	})
}

// CreateSubscriptionRequest holds the data for creating a subscription
type CreateSubscriptionRequest struct {
	TierID           string `json:"tierId"`
	Type             string `json:"type"` // "platform" or "creator"
	CreatorID        string `json:"creatorId"`
	SubscriptionType string `json:"subscriptionType"`
	UserID           string `json:"userId"`
}

// CreateSubscription handles subscription creation and redirects to Stripe
func CreateSubscription(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	log.Printf("[CreateSubscription] Starting for userID: %s", userID)

	var req CreateSubscriptionRequest
	if err := c.BodyParser(&req); err != nil {
		log.Printf("[CreateSubscription] Invalid request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
			"code":  "INVALID_REQUEST",
		})
	}

	// Log the request details
	reqJSON, _ := json.Marshal(req)
	log.Printf("[CreateSubscription] Request data: %s", string(reqJSON))

	// Configure Stripe key
	stripeKey := os.Getenv("STRIPE_SECRET_KEY")
	if stripeKey == "" {
		log.Printf("[CreateSubscription] Missing STRIPE_SECRET_KEY environment variable")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Stripe configuration error",
			"code":  "STRIPE_CONFIG_ERROR",
		})
	}

	stripe.Key = stripeKey
	log.Printf("[CreateSubscription] Stripe key configured: %s...", stripeKey[:8])

	// Get price ID based on tier
	priceID := getPriceIDForTier(req.TierID)
	if priceID == "" {
		log.Printf("[CreateSubscription] Invalid tier ID: %s", req.TierID)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid tier ID",
			"code":  "INVALID_TIER",
		})
	}

	// Verify price exists in Stripe
	p, err := price.Get(priceID, nil)
	if err != nil {
		log.Printf("[CreateSubscription] Error fetching price: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Invalid price configuration",
		})
	}

	// Prepare metadata for the subscription
	metadata := map[string]string{
		"userId": userID,
		"type":   req.Type,
		"tierId": req.TierID,
	}

	if req.CreatorID != "" {
		metadata["creatorId"] = req.CreatorID
	}

	// Create the Stripe checkout session
	params := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: []*string{
			stripe.String("card"),
		},
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Price:    stripe.String(p.ID),
				Quantity: stripe.Int64(1),
			},
		},
		Mode:              stripe.String(string(stripe.CheckoutSessionModeSubscription)),
		SuccessURL:        stripe.String("http://localhost:3000/subscription/success?session_id={CHECKOUT_SESSION_ID}"),
		CancelURL:         stripe.String("http://localhost:3000/subscription/cancel"),
		ClientReferenceID: stripe.String(userID),
		SubscriptionData: &stripe.CheckoutSessionSubscriptionDataParams{
			Metadata: metadata,
		},
	}

	s, err := session.New(params)
	if err != nil {
		log.Printf("[CreateSubscription] Failed to create Stripe session: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": fmt.Sprintf("Failed to create checkout session: %v", err),
			"code":  "STRIPE_SESSION_ERROR",
		})
	}

	log.Printf("[CreateSubscription] Successfully created session ID: %s", s.ID)
	return c.JSON(fiber.Map{
		"sessionId": s.ID,
		"success":   true,
	})
}

// GetSubscriptionStatus returns the user's current subscription status
func GetSubscriptionStatus(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	log.Printf("[GetSubscriptionStatus] Starting for userID: %s", userID)

	// Get platform subscription with retry logic
	platformSub, err := getUserPlatformSubscriptionWithRetry(userID)
	if err != nil {
		log.Printf("[GetSubscriptionStatus] Error fetching platform subscription: %v", err)
		// Return empty subscription rather than failing
		platformSub = nil
	}

	// Get creator subscriptions with retry logic
	creatorSubs, err := getUserAllCreatorSubscriptionsWithRetry(userID)
	if err != nil {
		log.Printf("[GetSubscriptionStatus] Error fetching creator subscriptions: %v", err)
		// Return empty array rather than failing
		creatorSubs = []models.CreatorSubscription{}
	}

	log.Printf("[GetSubscriptionStatus] Found %d creator subscriptions", len(creatorSubs))
	return c.JSON(fiber.Map{
		"platformSubscription": platformSub,
		"creatorSubscriptions": creatorSubs,
	})
}

// getUserPlatformSubscription gets a user's platform subscription
func getUserPlatformSubscription(userID string) (*models.PremiumSubscription, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Try both userID and userId cases
	ref := database.GetFirebaseDB().NewRef("premium_subscriptions")
	var subs map[string]models.PremiumSubscription

	// First try with userID
	err := ref.OrderByChild("userID").EqualTo(userID).Get(ctx, &subs)
	if err != nil {
		// Try with userId if userID fails
		err = ref.OrderByChild("userId").EqualTo(userID).Get(ctx, &subs)
		if err != nil {
			log.Printf("[getUserPlatformSubscription] Both index queries failed, falling back to full fetch")
			// Fall back to full fetch
			err = ref.Get(ctx, &subs)
			if err != nil {
				return nil, fmt.Errorf("subscription query failed: %w", err)
			}
		}
	}

	// Find active platform subscription
	for id, sub := range subs {
		if (sub.UserID == userID || sub.UserId == userID) &&
			sub.Type == "platform" &&
			sub.Status == "active" {
			log.Printf("[getUserPlatformSubscription] Found active platform subscription ID: %s", id)
			return &sub, nil
		}
	}

	return nil, nil
}

// getUserPlatformSubscriptionWithRetry adds retry logic to platform subscription queries
func getUserPlatformSubscriptionWithRetry(userID string) (*models.PremiumSubscription, error) {
	maxRetries := 3
	var lastErr error

	for i := 0; i < maxRetries; i++ {
		sub, err := getUserPlatformSubscription(userID)
		if err == nil {
			return sub, nil
		}

		lastErr = err
		log.Printf("[getUserPlatformSubscriptionWithRetry] Retry %d/%d failed: %v", i+1, maxRetries, err)
		time.Sleep(time.Duration(i+1) * 200 * time.Millisecond) // Exponential backoff
	}

	return nil, fmt.Errorf("failed after %d retries: %w", maxRetries, lastErr)
}

// getUserCreatorSubscription gets a user's subscription to a specific creator
func getUserCreatorSubscription(userID, creatorID string) (*models.CreatorSubscription, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	log.Printf("[getUserCreatorSubscription] Querying subscription for userID: %s, creatorID: %s", userID, creatorID)
	ref := database.GetFirebaseDB().NewRef("creator_subscriptions")

	// Query subscriptions using Realtime Database
	var allSubs map[string]models.CreatorSubscription

	var err error
	// First try with index
	err = ref.OrderByChild("subscriberId").EqualTo(userID).Get(ctx, &allSubs)

	// If index error, fall back to getting all subscriptions and filtering
	if err != nil && isIndexError(err) {
		log.Printf("[getUserCreatorSubscription] Index error, falling back to full fetch: %v", err)

		// Get all subscriptions and filter in memory
		err = ref.Get(ctx, &allSubs)
		if err != nil {
			return nil, fmt.Errorf("subscription query failed: %w", err)
		}
	} else if err != nil {
		return nil, fmt.Errorf("subscription query failed: %w", err)
	}

	// Find active subscription for specific creator and user
	for id, sub := range allSubs {
		if sub.SubscriberID == userID && sub.CreatorID == creatorID && sub.Status == "active" {
			log.Printf("[getUserCreatorSubscription] Found active creator subscription ID: %s", id)
			return &sub, nil
		}
	}

	log.Printf("[getUserCreatorSubscription] No active creator subscription found for userID: %s to creatorID: %s", userID, creatorID)
	return nil, nil
}

// getUserAllCreatorSubscriptions gets all creator subscriptions for a user
func getUserAllCreatorSubscriptions(userID string) ([]models.CreatorSubscription, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Get all subscriptions and filter in memory instead of using index
	ref := database.GetFirebaseDB().NewRef("creator_subscriptions")
	var allSubs map[string]models.CreatorSubscription

	if err := ref.Get(ctx, &allSubs); err != nil {
		return nil, fmt.Errorf("failed to fetch subscriptions: %w", err)
	}

	// Filter in memory
	var activeSubs []models.CreatorSubscription
	for _, sub := range allSubs {
		if sub.SubscriberID == userID && sub.Status == "active" {
			activeSubs = append(activeSubs, sub)
		}
	}

	return activeSubs, nil
}

// isTierSufficient checks if one tier is sufficient for accessing content that requires another tier
func isTierSufficient(userTier, requiredTier string) bool {
	// Simple tier hierarchy
	tiers := map[string]int{
		"basic": 1,
		"pro":   2,
		"vip":   3,
	}

	userLevel, userExists := tiers[userTier]
	requiredLevel, requiredExists := tiers[requiredTier]

	if !userExists || !requiredExists {
		log.Printf("[isTierSufficient] Invalid tier comparison: userTier=%s, requiredTier=%s", userTier, requiredTier)
		return false
	}

	result := userLevel >= requiredLevel
	log.Printf("[isTierSufficient] Comparing tiers: userTier=%s (%d), requiredTier=%s (%d), sufficient=%t",
		userTier, userLevel, requiredTier, requiredLevel, result)
	return result
}

// getPriceIDForTier returns the Stripe price ID for a tier
func getPriceIDForTier(tierID string) string {
	priceID := config.StripePriceConfig[tierID]
	if priceID == "" {
		log.Printf("[getPriceIDForTier] No price ID found for tier: %s", tierID)
		return ""
	}
	log.Printf("[getPriceIDForTier] Found price ID for tier %s: %s", tierID, priceID)
	return priceID
}

// updatePlatformSubscriptionStatus updates the status of a platform subscription
func updatePlatformSubscriptionStatus(userID, subscriptionID, status string) error {
	ctx := context.Background()
	query := database.PremiumSubscriptions().Where("userID", "==", userID).
		Where("stripeSubID", "==", subscriptionID).
		Limit(1)

	docs, err := query.Documents(ctx).GetAll()
	if err != nil {
		return err
	}

	if len(docs) == 0 {
		return fmt.Errorf("subscription not found")
	}

	_, err = docs[0].Ref.Update(ctx, []firestore.Update{
		{Path: "status", Value: status},
		{Path: "updatedAt", Value: time.Now()},
	})

	return err
}

// updateCreatorSubscriptionStatus updates the status of a creator subscription
func updateCreatorSubscriptionStatus(subscriptionID, status string) error {
	ctx := context.Background()
	query := database.CreatorSubscriptions().Where("stripeSubID", "==", subscriptionID).
		Limit(1)

	docs, err := query.Documents(ctx).GetAll()
	if err != nil {
		return err
	}

	if len(docs) == 0 {
		return fmt.Errorf("subscription not found")
	}

	_, err = docs[0].Ref.Update(ctx, []firestore.Update{
		{Path: "status", Value: status},
		{Path: "updatedAt", Value: time.Now()},
	})

	return err
}

// Add helper function to detect index errors
func isIndexError(err error) bool {
	return err != nil && (strings.Contains(err.Error(), "Index not defined") ||
		strings.Contains(err.Error(), ".indexOn") ||
		strings.Contains(err.Error(), "400"))
}
