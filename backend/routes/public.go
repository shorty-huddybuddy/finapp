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

	// calender routes
	app.Get("/api/calender/events", handlers.FetchEvents)
	app.Post("/api/calender/events", handlers.CreateEvent)
	app.Put("/api/calender/events/:id", handlers.UpdateEvent)
	app.Delete("/api/calender/events/:id", handlers.DeleteEvent)

	app.Get("/api/calender/notifications", handlers.FetchNotifications)
	app.Get("/api/calender/insights", handlers.FetchInsights)
	app.Get("/api/calender/market-events", handlers.FetchMarketEvents)
	app.Get("/api/calender/risk-alerts", handlers.FetchRiskAlerts)
	app.Get("/api/calender/goals", handlers.FetchGoals)

	// Protected Social Media Routes
	social := app.Group("/api/social")
	social.Use(middleware.AuthMiddleware()) // Apply auth middleware to all social routes
	social.Post("/posts", handlers.NewPostHandler().CreatePost)
	social.Get("/posts/:id", handlers.NewPostHandler().GetPost)
	social.Get("/posts", handlers.NewPostHandler().GetAllPosts)
	social.Delete("/posts/:id", handlers.NewPostHandler().DeletePost)

	// Like routes
	social.Post("/posts/:postId/like", handlers.NewLikeHandler().ToggleLike)
	social.Get("/posts/:postId/like/status", handlers.NewLikeHandler().GetLikeStatus)


	// Comment routes
	social.Post("/posts/:postId/comments", handlers.NewCommentHandler().CreateComment)
	social.Get("/posts/:postId/comments", handlers.NewCommentHandler().GetComments)
	social.Delete("/posts/:postId/comments/:commentId", handlers.NewCommentHandler().DeleteComment)

	// Protected route (requires authentication)
	app.Get("/protected", handlers.ProtectedHandler)

	// Chatbot route
	app.Post("/generate", handlers.ChatbotHandler)

	// Watchlist routes
	app.All("/api/watchlist", handlers.WatchlistHandler)

	app.Get("/api/search", handlers.SearchHandler)
	app.Get("/api/price", handlers.PriceHandler)

}
