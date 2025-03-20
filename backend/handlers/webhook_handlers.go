package handlers

import (
	"backend/database"
	"backend/models"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/stripe/stripe-go/v81"
	"github.com/stripe/stripe-go/v81/webhook"
)

// HandleStripeWebhook processes webhooks from Stripe
func HandleStripeWebhook(c *fiber.Ctx) error {
	// Get the webhook signature from the header
	stripeSignature := c.Get("Stripe-Signature")

	// Read the request body
	payload := c.Body()

	// Use env var for webhook secret
	endpointSecret := os.Getenv("STRIPE_WEBHOOK_SECRET")

	// Verify the webhook signature
	event, err := webhook.ConstructEvent(payload, stripeSignature, endpointSecret)
	if err != nil {
		log.Printf("Error verifying webhook signature: %v\n", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid webhook signature",
		})
	}

	// Process different event types
	switch event.Type {
	case "checkout.session.completed":
		var session stripe.CheckoutSession
		if err := json.Unmarshal(event.Data.Raw, &session); err != nil {
			return fmt.Errorf("error parsing webhook JSON: %v", err)
		}
		err = handleCheckoutCompleted(session)

	case "customer.subscription.updated":
		var subscription stripe.Subscription
		if err := json.Unmarshal(event.Data.Raw, &subscription); err != nil {
			return fmt.Errorf("error parsing webhook JSON: %v", err)
		}
		err = handleSubscriptionUpdated(subscription)

	case "customer.subscription.deleted":
		var subscription stripe.Subscription
		if err := json.Unmarshal(event.Data.Raw, &subscription); err != nil {
			return fmt.Errorf("error parsing webhook JSON: %v", err)
		}
		err = handleSubscriptionCanceled(subscription)

	case "invoice.payment_succeeded":
		var invoice stripe.Invoice
		if err := json.Unmarshal(event.Data.Raw, &invoice); err != nil {
			return fmt.Errorf("error parsing webhook JSON: %v", err)
		}
		err = handlePaymentSucceeded(invoice)

	case "invoice.payment_failed":
		var invoice stripe.Invoice
		if err := json.Unmarshal(event.Data.Raw, &invoice); err != nil {
			return fmt.Errorf("error parsing webhook JSON: %v", err)
		}
		err = handlePaymentFailed(invoice)
	}

	if err != nil {
		log.Printf("Error processing webhook: %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": fmt.Sprintf("Error processing webhook: %v", err),
		})
	}

	return c.SendString("Webhook received")
}

// handleCheckoutCompleted processes successful checkout sessions
func handleCheckoutCompleted(session stripe.CheckoutSession) error {
	log.Printf("Processing checkout.session.completed: %s", session.ID)

	// Get metadata from the session
	userID := session.ClientReferenceID

	// Check for required fields
	if userID == "" {
		return fmt.Errorf("missing user ID in client reference")
	}

	// Debug: Log all metadata to diagnose issue
	log.Printf("Session metadata: %v", session.Metadata)

	// Get subscription ID from the session
	var subscriptionID string
	if session.Subscription != nil {
		subscriptionID = session.Subscription.ID // Access the ID field from the Subscription object
	} else {
		return fmt.Errorf("missing subscription ID")
	}

	// Get metadata - use defaults if missing
	subscriptionType := "platform" // Default to platform
	tierID := "premium-monthly"    // Default tier

	if session.Metadata != nil {
		if t, ok := session.Metadata["type"]; ok && t != "" {
			subscriptionType = t
		}
		if t, ok := session.Metadata["tierId"]; ok && t != "" {
			tierID = t
		}
	}

	creatorID := ""
	if session.Metadata != nil {
		creatorID = session.Metadata["creatorId"]
	}

	// Create subscription in database based on type
	ctx := context.Background()

	if subscriptionType == "platform" || subscriptionType == "" {
		// Create platform subscription
		platformSub := models.PremiumSubscription{
			ID:            uuid.New().String(),
			UserID:        userID,
			Status:        "active",
			Type:          "platform",
			TierID:        tierID,
			StartDate:     time.Now(),
			EndDate:       time.Now().AddDate(0, 1, 0),
			AutoRenew:     true,
			PaymentStatus: "paid",
			StripeSubID:   subscriptionID,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		}

		// Save to Firebase Realtime Database
		ref := database.GetFirebaseDB().NewRef(fmt.Sprintf("premium_subscriptions/%s", platformSub.ID))
		if err := ref.Set(ctx, platformSub); err != nil {
			return err
		}

		// Update user's premium status
		userRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("users/%s", userID))
		return userRef.Update(ctx, map[string]interface{}{
			"isPremium": true,
		})
	} else if subscriptionType == "creator" && creatorID != "" {
		// Create creator subscription
		creatorSub := models.CreatorSubscription{
			ID:           uuid.New().String(),
			SubscriberID: userID,
			CreatorID:    creatorID,
			TierID:       tierID,
			Status:       "active",
			StartDate:    time.Now(),
			EndDate:      time.Now().AddDate(0, 1, 0),
			AutoRenew:    true,
			StripeSubID:  subscriptionID,
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		}

		// Save to Firebase Realtime Database
		ref := database.GetFirebaseDB().NewRef(fmt.Sprintf("creator_subscriptions/%s", creatorSub.ID))
		if err := ref.Set(ctx, creatorSub); err != nil {
			return err
		}

		// Update creator's subscriber count - get all data and filter in memory
		creatorRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("users/%s", creatorID))
		var creator models.User
		if err := creatorRef.Get(ctx, &creator); err == nil && creator.CreatorProfile != nil {
			creator.CreatorProfile.SubscriberCount++
			return creatorRef.Update(ctx, map[string]interface{}{
				"creatorProfile/subscriberCount": creator.CreatorProfile.SubscriberCount,
			})
		}
	} else {
		return fmt.Errorf("invalid subscription configuration - type: %s, creatorId: %s",
			subscriptionType, creatorID)
	}

	return nil
}

// handleSubscriptionUpdated processes subscription update events
func handleSubscriptionUpdated(subscription stripe.Subscription) error {
	// Debug log the subscription data
	log.Printf("Processing subscription update for subscription: %s", subscription.ID)

	// Get all metadata - be more tolerant of missing values
	subscriptionType := ""
	if subscription.Metadata != nil {
		subscriptionType = subscription.Metadata["type"]
	}
	subscriptionID := subscription.ID
	status := string(subscription.Status)
	ctx := context.Background()

	// Find subscription in database - fetch all and filter in memory
	if subscriptionType == "platform" || subscriptionType == "" {
		// Get all platform subscriptions and filter
		ref := database.GetFirebaseDB().NewRef("premium_subscriptions")
		var allSubs map[string]models.PremiumSubscription
		if err := ref.Get(ctx, &allSubs); err != nil {
			return fmt.Errorf("failed to fetch subscriptions: %w", err)
		}

		// Find matching subscription by Stripe ID
		for id, sub := range allSubs {
			if sub.StripeSubID == subscriptionID {
				subRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("premium_subscriptions/%s", id))
				return subRef.Update(ctx, map[string]interface{}{
					"status":    status,
					"updatedAt": time.Now(),
				})
			}
		}

		log.Printf("No matching platform subscription found for Stripe ID: %s", subscriptionID)

	} else if subscriptionType == "creator" {
		// Get all creator subscriptions and filter
		ref := database.GetFirebaseDB().NewRef("creator_subscriptions")
		var allSubs map[string]models.CreatorSubscription
		if err := ref.Get(ctx, &allSubs); err != nil {
			return fmt.Errorf("failed to fetch creator subscriptions: %w", err)
		}

		// Find matching subscription by Stripe ID
		for id, sub := range allSubs {
			if sub.StripeSubID == subscriptionID {
				subRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("creator_subscriptions/%s", id))
				return subRef.Update(ctx, map[string]interface{}{
					"status":    status,
					"updatedAt": time.Now(),
				})
			}
		}

		log.Printf("No matching creator subscription found for Stripe ID: %s", subscriptionID)
	}

	return nil
}

// handleSubscriptionCanceled processes subscription cancellation events
func handleSubscriptionCanceled(subscription stripe.Subscription) error {
	// Mark subscription as cancelled in database
	metadata := subscription.Metadata
	if metadata == nil {
		return fmt.Errorf("missing metadata")
	}

	subscriptionType := metadata["type"]
	subscriptionID := subscription.ID
	ctx := context.Background()

	if subscriptionType == "platform" {
		// Find platform subscription by Stripe ID
		ref := database.GetFirebaseDB().NewRef("premium_subscriptions")
		query := ref.OrderByChild("stripeSubID").EqualTo(subscriptionID).LimitToFirst(1)

		var results map[string]models.PremiumSubscription
		if err := query.Get(ctx, &results); err != nil {
			return fmt.Errorf("subscription query failed: %v", err)
		}

		if len(results) == 0 {
			return fmt.Errorf("subscription not found")
		}

		// Update the first matching subscription and handle user premium status
		for id, sub := range results {
			subRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("premium_subscriptions/%s", id))
			err := subRef.Update(ctx, map[string]interface{}{
				"status":    "cancelled",
				"updatedAt": time.Now(),
			})
			if err != nil {
				return err
			}

			// Update user's premium status if needed
			// Check if user has other active platform subscriptions
			otherSubsRef := database.GetFirebaseDB().NewRef("premium_subscriptions")
			otherSubsQuery := otherSubsRef.OrderByChild("userID").EqualTo(sub.UserID)

			var otherSubs map[string]models.PremiumSubscription
			if err := otherSubsQuery.Get(ctx, &otherSubs); err != nil {
				return err
			}

			// Check if user has any other active subscriptions
			hasActiveSubscription := false
			for otherId, otherSub := range otherSubs {
				if otherId != id && otherSub.Status == "active" {
					hasActiveSubscription = true
					break
				}
			}

			// If no active subscriptions, remove premium status
			if !hasActiveSubscription {
				userRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("users/%s", sub.UserID))
				if err := userRef.Update(ctx, map[string]interface{}{"isPremium": false}); err != nil {
					return err
				}
			}

			return nil
		}
	} else if subscriptionType == "creator" {
		// Find creator subscription by Stripe ID
		ref := database.GetFirebaseDB().NewRef("creator_subscriptions")
		query := ref.OrderByChild("stripeSubID").EqualTo(subscriptionID).LimitToFirst(1)

		var results map[string]models.CreatorSubscription
		if err := query.Get(ctx, &results); err != nil {
			return fmt.Errorf("subscription query failed: %v", err)
		}

		if len(results) == 0 {
			return fmt.Errorf("subscription not found")
		}

		// Update the first matching subscription and handle creator subscriber count
		for id, sub := range results {
			subRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("creator_subscriptions/%s", id))
			err := subRef.Update(ctx, map[string]interface{}{
				"status":    "cancelled",
				"updatedAt": time.Now(),
			})
			if err != nil {
				return err
			}

			// Update creator's subscriber count
			creatorRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("users/%s", sub.CreatorID))
			var creator models.User
			if err := creatorRef.Get(ctx, &creator); err == nil && creator.CreatorProfile != nil {
				if creator.CreatorProfile.SubscriberCount > 0 {
					return creatorRef.Update(ctx, map[string]interface{}{
						"creatorProfile/subscriberCount": creator.CreatorProfile.SubscriberCount - 1,
					})
				}
			}

			return nil
		}
	}

	return nil
}

// handlePaymentSucceeded processes successful payment events
func handlePaymentSucceeded(invoice stripe.Invoice) error {
	// Debug logging
	log.Printf("Processing payment succeeded for invoice: %s", invoice.ID)

	var subscriptionID string
	if invoice.Subscription != nil {
		subscriptionID = invoice.Subscription.ID // Access the ID field from the Subscription object
	}

	if subscriptionID == "" {
		log.Printf("No subscription ID found in invoice")
		return nil // Not a subscription payment
	}

	ctx := context.Background()

	// Get all subscriptions and filter in memory instead of using OrderByChild
	// First check platform subscriptions
	platformRef := database.GetFirebaseDB().NewRef("premium_subscriptions")
	var platformSubs map[string]models.PremiumSubscription
	if err := platformRef.Get(ctx, &platformSubs); err != nil {
		log.Printf("Error fetching platform subscriptions: %v", err)
	} else {
		// Process matching platform subscriptions
		for id, sub := range platformSubs {
			if sub.StripeSubID == subscriptionID {
				// Record payment
				paymentID := uuid.New().String()
				payment := models.SubscriptionPayment{
					ID:              paymentID,
					SubscriptionID:  id,
					Amount:          float64(invoice.AmountPaid) / 100.0,
					Currency:        string(invoice.Currency),
					Status:          "paid",
					StripePaymentID: invoice.ID,
					CreatedAt:       time.Now(),
				}

				// Save payment record
				paymentRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("subscription_payments/%s", paymentID))
				if err := paymentRef.Set(ctx, payment); err != nil {
					log.Printf("Error recording payment: %v", err)
				}

				// Update subscription end date
				newEndDate := time.Now().AddDate(0, 1, 0) // Add 1 month
				subRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("premium_subscriptions/%s", id))
				if err := subRef.Update(ctx, map[string]interface{}{
					"endDate":       newEndDate,
					"paymentStatus": "paid",
					"updatedAt":     time.Now(),
				}); err != nil {
					log.Printf("Error updating subscription end date: %v", err)
				}

				return nil
			}
		}
	}

	// Check creator subscriptions
	creatorRef := database.GetFirebaseDB().NewRef("creator_subscriptions")
	var creatorSubs map[string]models.CreatorSubscription
	if err := creatorRef.Get(ctx, &creatorSubs); err != nil {
		log.Printf("Error fetching creator subscriptions: %v", err)
		return err
	}

	// Process creator subscriptions
	for id, sub := range creatorSubs {
		if sub.StripeSubID == subscriptionID {
			// Record payment
			paymentID := uuid.New().String()
			payment := models.SubscriptionPayment{
				ID:              paymentID,
				SubscriptionID:  id,
				Amount:          float64(invoice.AmountPaid) / 100.0,
				Currency:        string(invoice.Currency),
				Status:          "paid",
				StripePaymentID: invoice.ID,
				CreatedAt:       time.Now(),
			}

			// Save payment record
			paymentRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("subscription_payments/%s", paymentID))
			if err := paymentRef.Set(ctx, payment); err != nil {
				log.Printf("Error recording payment: %v", err)
				return err
			}

			// Update subscription end date
			newEndDate := time.Now().AddDate(0, 1, 0) // Add 1 month
			subRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("creator_subscriptions/%s", id))
			if err := subRef.Update(ctx, map[string]interface{}{
				"endDate":   newEndDate,
				"updatedAt": time.Now(),
			}); err != nil {
				log.Printf("Error updating subscription end date: %v", err)
				return err
			}

			// Update creator earnings
			creatorRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("users/%s", sub.CreatorID))
			var creator models.User
			if err := creatorRef.Get(ctx, &creator); err == nil && creator.CreatorProfile != nil {
				// Calculate creator's cut (e.g. 70%)
				creatorCut := payment.Amount * 0.7
				newEarnings := creator.CreatorProfile.TotalEarnings + creatorCut

				if err := creatorRef.Update(ctx, map[string]interface{}{
					"creatorProfile/totalEarnings": newEarnings,
				}); err != nil {
					log.Printf("Failed to update creator earnings: %v", err)
					return err
				}
			}

			return nil
		}
	}

	log.Printf("No matching subscription found for Stripe ID: %s", subscriptionID)
	return nil
}

// handlePaymentFailed processes failed payment events
func handlePaymentFailed(invoice stripe.Invoice) error {
	subscriptionID := invoice.Subscription.ID
	if subscriptionID == "" {
		return nil // Not a subscription payment
	}

	ctx := context.Background()

	// Update platform subscription if found
	platformRef := database.GetFirebaseDB().NewRef("premium_subscriptions")
	platformQuery := platformRef.OrderByChild("stripeSubID").EqualTo(subscriptionID).LimitToFirst(1)

	var platformSubs map[string]models.PremiumSubscription
	if err := platformQuery.Get(ctx, &platformSubs); err != nil {
		return err
	}

	if len(platformSubs) > 0 {
		for id := range platformSubs {
			subRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("premium_subscriptions/%s", id))
			if err := subRef.Update(ctx, map[string]interface{}{
				"paymentStatus": "failed",
				"updatedAt":     time.Now(),
			}); err != nil {
				log.Printf("Error updating payment status: %v", err)
				return err
			}
		}
	}

	// Update creator subscription if found
	creatorRef := database.GetFirebaseDB().NewRef("creator_subscriptions")
	creatorQuery := creatorRef.OrderByChild("stripeSubID").EqualTo(subscriptionID).LimitToFirst(1)

	var creatorSubs map[string]models.CreatorSubscription
	if err := creatorQuery.Get(ctx, &creatorSubs); err != nil {
		return err
	}

	if len(creatorSubs) > 0 {
		for id := range creatorSubs {
			subRef := database.GetFirebaseDB().NewRef(fmt.Sprintf("creator_subscriptions/%s", id))
			if err := subRef.Update(ctx, map[string]interface{}{
				"paymentStatus": "failed",
				"updatedAt":     time.Now(),
			}); err != nil {
				log.Printf("Error updating payment status: %v", err)
				return err
			}
		}
	}

	return nil
}
