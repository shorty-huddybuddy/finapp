package routes

import (
	"backend/handlers"
	"backend/middleware"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {
	// Public routes (no authentication required)
	app.Get("/", handlers.PublicHandler)
	app.Get("/api/test/firebase", handlers.TestDatabaseConnection)

	// Protected Social Media Routes
	social := app.Group("/api/social")
	social.Use(middleware.AuthMiddleware()) // Apply auth middleware to all social routes
	social.Post("/posts", handlers.NewPostHandler().CreatePost)
	social.Get("/posts/:id", handlers.NewPostHandler().GetPost)
	social.Get("/posts", handlers.NewPostHandler().GetAllPosts)

	// Protected route (requires authentication)
	app.Get("/protected", handlers.ProtectedHandler)

	// Chatbot route
	app.Post("/generate", handlers.ChatbotHandler)

	// Watchlist routes
	app.All("/api/watchlist", handlers.WatchlistHandler)

	app.Get("/api/search", handlers.SearchHandler)
	app.Get("/api/price", handlers.PriceHandler)
}
