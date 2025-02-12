package routes

import (
	"backend/handlers"
	"backend/middleware"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {
	// Public routes
	app.Get("/", handlers.PublicHandler)
	app.Get("/api/test/firebase", handlers.TestDatabaseConnection)

	// Protected routes
	protected := app.Group("/api")
	protected.Use(middleware.AuthMiddleware())

	// Social routes
	social := protected.Group("/social")
	social.Post("/posts", handlers.NewPostHandler().CreatePost)
	social.Get("/posts/:id", handlers.NewPostHandler().GetPost)
	social.Get("/posts", handlers.NewPostHandler().GetAllPosts)

	// Other protected routes
	protected.Get("/watchlist", handlers.WatchlistHandler)
	protected.Get("/search", handlers.SearchHandler)
	protected.Get("/price", handlers.PriceHandler)

	// Chatbot route
	app.Post("/generate", handlers.ChatbotHandler)
}
