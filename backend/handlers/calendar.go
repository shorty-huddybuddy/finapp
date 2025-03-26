package handlers

import (
	"context"
	"fmt"
	"log"
	"time"

	"backend/database"

	"github.com/gofiber/fiber/v2"
)

type extendedProps struct {
	Category   string `json:"category"`
	Recurrence string `json:"recurrence,omitempty"`
}

type Event struct {
	ID            string        `json:"id,omitempty"`
	Title         string        `json:"title"`
	Start         string        `json:"start"`
	End           string        `json:"end"`
	ExtendedProps extendedProps `json:"extendedProps"`
}

// Fetch all events from Firebase Realtime Database for a specific user
func FetchEvents(c *fiber.Ctx) error {
	ctx := context.Background()

	userId := c.Locals("userId").(string)
	
	ref := database.FirebaseDB.NewRef(fmt.Sprintf("users/%s/calendar_events", userId))

	println("in fetching events for user:", userId)

	// Map to store the fetched data
	var eventsMap map[string]Event

	// Get data from Firebase Realtime Database
	if err := ref.Get(ctx, &eventsMap); err != nil {
		log.Println("Error fetching events for user", userId, ":", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch events"})
	}

	// Convert map to slice
	events := []Event{}
	for id, event := range eventsMap {
		event.ID = id
		events = append(events, event)
	}

	return c.JSON(events)
}

// CreateEvent - Adds an event to Firebase Realtime Database for a specific user
func CreateEvent(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	var event Event
	if err := c.BodyParser(&event); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	// Reference the user-specific "calendar_events" node in Realtime DB
	ref := database.FirebaseDB.NewRef(fmt.Sprintf("users/%s/calendar_events", userId))

	// Push new event (Firebase will generate a unique ID)
	newRef, err := ref.Push(context.Background(), event)
	if err != nil {
		log.Println("Error creating event for user", userId, ":", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create event"})
	}

	// Return success response
	return c.JSON(fiber.Map{
		"message": "Event data added successfully",
		"id":      newRef.Key,
	})
}

// Update an event in Firebase Realtime Database for a specific user
func UpdateEvent(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	id := c.Params("id") // Firebase RTDB key
	var updatedEvent Event

	// Parse request body
	if err := c.BodyParser(&updatedEvent); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	// Reference the event by its unique ID in Firebase RTDB for this user
	ref := database.FirebaseDB.NewRef(fmt.Sprintf("users/%s/calendar_events", userId)).Child(id)

	// Update the event data
	if err := ref.Set(context.Background(), updatedEvent); err != nil {
		log.Println("Error updating event for user", userId, ":", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update event"})
	}

	// Return the updated event
	return c.JSON(fiber.Map{
		"message": "Event updated successfully",
		"event":   updatedEvent,
	})
}

// Delete an event from Firebase Realtime Database for a specific user
func DeleteEvent(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	id := c.Params("id") // Firebase RTDB key

	// Reference the event by its unique ID in Firebase RTDB for this user
	ref := database.FirebaseDB.NewRef(fmt.Sprintf("users/%s/calendar_events", userId)).Child(id)

	// Delete the event
	if err := ref.Delete(context.Background()); err != nil {
		log.Println("Error deleting event for user", userId, ":", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete event"})
	}

	return c.JSON(fiber.Map{"message": "Event deleted successfully"})
}

// Fetch upcoming events for notifications for a specific user
func FetchNotifications(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	ctx := context.Background()
	ref := database.FirebaseDB.NewRef(fmt.Sprintf("users/%s/calendar_events", userId))

	println("in notification events for user:", userId)

	// Fetch events directly into a map
	var eventsMap map[string]Event
	if err := ref.Get(ctx, &eventsMap); err != nil {
		log.Println("Error fetching events for user", userId, ":", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch events"})
	}

	// Get the current date
	today := time.Now()

	// Process events efficiently while iterating
	notifications := make([]string, 0, 3)
	for _, event := range eventsMap {
		// Parse the event start date
		eventTime, err := time.Parse("2006-01-02", event.Start[:10])

		if err != nil || eventTime.Before(today) {
			continue // Skip past/invalid dates
		}

		// Append event notification
		notifications = append(notifications, event.Title+" on "+event.Start[:10])

		// Stop after collecting 3 upcoming events
		if len(notifications) == 3 {
			break
		}
	}

	if len(notifications) == 0 {
		notifications = append(notifications, "No upcoming events")
	}

	return c.JSON(notifications)
}

// Fetch insights for a specific user
func FetchInsights(c *fiber.Ctx) error {
	insights := []string{"Consider increasing your SIP amount", "You can save ₹5000 by optimizing your bills"}
	return c.JSON(insights)
}

// Fetch market events that may be relevant to the specific user
func FetchMarketEvents(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	// In a real app, you would fetch user-specific market events based on their portfolio/preferences
	marketEvents := []string{
		fmt.Sprintf("For user %s: IPO: TechCorp launching next week", userId),
		fmt.Sprintf("For user %s: Q2 Results: Major banks reporting this month", userId),
	}
	return c.JSON(marketEvents)
}

// Fetch risk alerts for a specific user
func FetchRiskAlerts(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	// In a real app, you would fetch user-specific risk alerts based on their portfolio
	riskAlerts := []string{
		fmt.Sprintf("User %s: High market volatility expected next week", userId),
		fmt.Sprintf("User %s: Currency fluctuations may impact international investments", userId),
	}
	return c.JSON(riskAlerts)
}

// Fetch financial goals for a specific user
func FetchGoals(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	// In a real app, you would fetch these from a user-specific database node
	goals := []map[string]interface{}{
		{"name": fmt.Sprintf("User %s: Save ₹100,000 for emergency fund", userId), "progress": 75},
		{"name": fmt.Sprintf("User %s: Invest ₹50,000 in mutual funds", userId), "progress": 40},
	}
	return c.JSON(goals)
}