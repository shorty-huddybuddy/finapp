package routes

import (
	"backend/handlers"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {
	// Public route (no authentication required)
	app.Get("/", handlers.PublicHandler)

	// Protected route (requires authentication)
	app.Get("/protected", handlers.ProtectedHandler)

	// Chatbot route
	app.Post("/generate", handlers.ChatbotHandler)

	// Watchlist routes
	app.All("/api/watchlist", handlers.WatchlistHandler)

	app.Get("/api/search", handlers.SearchHandler)
}
