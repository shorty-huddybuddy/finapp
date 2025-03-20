package handlers

import (
	"backend/database"
	"backend/models"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
)

// GetUserPermissions fetches a user's permissions including subscription status
func GetUserPermissions(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	log.Printf("[GetUserPermissions] Starting for userID: %s", userID)

	if userID == "" {
		log.Printf("[GetUserPermissions] Error: Missing userID")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
			"code":  "MISSING_USER_ID",
		})
	}

	ctx := context.Background()
	userRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("users/%s", userID))

	// Debug: Print raw data
	var rawData map[string]interface{}
	if err := userRef.Get(ctx, &rawData); err != nil {
		log.Printf("[GetUserPermissions] Raw data fetch error: %v", err)
	} else {
		rawJSON, _ := json.MarshalIndent(rawData, "", "  ")
		log.Printf("[GetUserPermissions] Raw user data: %s", string(rawJSON))
	}

	var user models.User
	if err := userRef.Get(ctx, &user); err != nil {
		log.Printf("[GetUserPermissions] Creating new user for ID %s. Error: %v", userID, err)

		// Initialize new user with safe defaults
		newUser := models.User{
			ID:        userID,
			IsPremium: false,
			IsCreator: true,
			CreatorProfile: &models.Creator{
				Bio:             "",
				Categories:      make([]string, 0),
				SubscriberCount: 0,
				TotalEarnings:   0,
				AvailableTiers:  []string{"basic", "pro", "vip"},
			},
			CreatedAt:           time.Now(),
			UpdatedAt:           time.Now(),
			ActiveSubscriptions: make([]string, 0),
		}

		// Attempt to save new user
		if err := userRef.Set(ctx, newUser); err != nil {
			log.Printf("[GetUserPermissions] Failed to save new user: %v", err)
			// Continue with in-memory data even if save fails
		} else {
			log.Printf("[GetUserPermissions] Successfully created new user")
		}
		user = newUser
	}

	// Validate user data integrity
	if user.CreatorProfile == nil {
		log.Printf("[GetUserPermissions] Warning: CreatorProfile is nil for user %s", userID)
		user.CreatorProfile = &models.Creator{
			Bio:             "",
			Categories:      make([]string, 0),
			SubscriberCount: 0,
			TotalEarnings:   0,
			AvailableTiers:  []string{"basic", "pro", "vip"},
		}

		// Try to update the missing profile
		if err := userRef.Update(ctx, map[string]interface{}{
			"creatorProfile": user.CreatorProfile,
			"updatedAt":      time.Now(),
		}); err != nil {
			log.Printf("[GetUserPermissions] Failed to update missing CreatorProfile: %v", err)
		}
	}

	// Build response with detailed error checking
	permissions := fiber.Map{
		"isPremium": user.IsPremium,
		"isCreator": true,
	}

	if user.CreatorProfile != nil {
		permissions["creatorProfile"] = user.CreatorProfile
	}

	// Check subscriptions with error handling and better error messages
	platformSub, err := getUserPlatformSubscription(userID)
	if err != nil {
		log.Printf("[GetUserPermissions] Error fetching platform subscription: %v", err)
		// Continue execution instead of returning error
		// This allows the API to still return other user data
	} else if platformSub != nil && platformSub.Status == "active" {
		permissions["isPremium"] = true
		permissions["subscriptionTier"] = "platform-premium"
	}

	// Add retry logic for creator subscriptions
	creatorSubs, err := getUserAllCreatorSubscriptionsWithRetry(userID)
	if err != nil {
		log.Printf("[GetUserPermissions] Error fetching creator subscriptions: %v", err)
		// Continue execution with empty subscriptions
		permissions["creatorSubscriptions"] = []models.CreatorSubscription{}
	} else if len(creatorSubs) > 0 {
		permissions["creatorSubscriptions"] = creatorSubs
	}

	log.Printf("[GetUserPermissions] Successfully processed user %s. Permissions: %+v", userID, permissions)
	return c.JSON(permissions)
}

// SignupAsCreatorRequest with validation
type SignupAsCreatorRequest struct {
	Bio        string   `json:"bio" validate:"required,min=10,max=500"`
	Categories []string `json:"categories" validate:"required,min=1,dive,required"`
	Tiers      []string `json:"tiers" validate:"required,min=1,dive,oneof=basic pro vip"`
}

// SignupAsCreator with enhanced error handling
func SignupAsCreator(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	log.Printf("[SignupAsCreator] Starting for userID: %s", userID)

	if userID == "" {
		log.Printf("[SignupAsCreator] Error: Missing userID")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Unauthorized",
			"code":  "MISSING_USER_ID",
		})
	}

	var req SignupAsCreatorRequest
	if err := c.BodyParser(&req); err != nil {
		log.Printf("[SignupAsCreator] Invalid request body: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   "Invalid request body",
			"code":    "INVALID_REQUEST",
			"details": err.Error(),
		})
	}

	// Validate request data
	if len(req.Bio) < 10 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bio must be at least 10 characters",
			"code":  "INVALID_BIO_LENGTH",
		})
	}

	// Get user reference
	ctx := context.Background()
	userRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("users/%s", userID))

	// Create updated creator profile
	creatorProfile := models.Creator{
		Bio:             req.Bio,
		Categories:      req.Categories,
		SubscriberCount: 0, // Don't reset if exists
		TotalEarnings:   0, // Don't reset if exists
		AvailableTiers:  req.Tiers,
	}

	// First get existing profile to preserve stats
	var existingUser models.User
	if err := userRef.Get(ctx, &existingUser); err == nil &&
		existingUser.CreatorProfile != nil {
		creatorProfile.SubscriberCount = existingUser.CreatorProfile.SubscriberCount
		creatorProfile.TotalEarnings = existingUser.CreatorProfile.TotalEarnings
	}

	// Update creator profile
	updates := map[string]interface{}{
		"isCreator":      true,
		"creatorProfile": creatorProfile,
		"updatedAt":      time.Now(),
	}

	if err := userRef.Update(ctx, updates); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": fmt.Sprintf("Failed to update user profile: %v", err),
		})
	}

	log.Printf("[SignupAsCreator] Successfully updated creator profile for user %s", userID)
	return c.JSON(fiber.Map{
		"success": true,
		"message": "Creator profile updated successfully",
		"profile": creatorProfile,
	})
}

// Add helper function for retrying subscription queries
func getUserAllCreatorSubscriptionsWithRetry(userID string) ([]models.CreatorSubscription, error) {
	maxRetries := 3
	var lastErr error

	for i := 0; i < maxRetries; i++ {
		subs, err := getUserAllCreatorSubscriptions(userID)
		if err == nil {
			return subs, nil
		}
		lastErr = err
		time.Sleep(time.Duration(i+1) * 100 * time.Millisecond) // Exponential backoff
	}

	return nil, fmt.Errorf("failed after %d retries: %v", maxRetries, lastErr)
}

// Helper functions are shared with subscription_handlers.go
